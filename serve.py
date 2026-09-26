#!/usr/bin/env python3
"""
CampusBazaar — local server with JSON-file storage.

All site data (listings, admins, author, student verifications) lives in
db.json next to this file. The pages talk to this server through a tiny API:

    GET  /api/<collection>     -> returns that collection as JSON
    PUT  /api/<collection>     -> replaces that collection and saves db.json
    POST /api/reset            -> restores db.json from db.seed.json

<collection> is one of: listings, admins, author, verifications

Because db.json is re-read on every request, you can also open it in an
editor, change something, and just refresh the browser.

Usage:
    python3 serve.py
Then open: http://localhost:8000/index.html      (Stop with Ctrl+C)
"""
import http.server
import json
import os
import shutil
import socketserver
import sys
import tempfile
import threading

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
DB_PATH = os.path.join(ROOT, 'db.json')
SEED_PATH = os.path.join(ROOT, 'db.seed.json')
COLLECTIONS = ('listings', 'admins', 'author', 'verifications')
LOCK = threading.Lock()


def read_db():
    try:
        with open(DB_PATH, encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def write_db(db):
    # write to a temp file first, then swap it in, so a crash mid-write
    # can never leave db.json half-written
    fd, tmp = tempfile.mkstemp(dir=ROOT, suffix='.tmp')
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        f.write('\n')
    os.replace(tmp, DB_PATH)


if not os.path.exists(DB_PATH) and os.path.exists(SEED_PATH):
    shutil.copy(SEED_PATH, DB_PATH)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # keep the console quiet

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def _json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _collection(self):
        parts = self.path.split('?')[0].strip('/').split('/')
        if len(parts) == 2 and parts[0] == 'api':
            return parts[1]
        return None

    def do_GET(self):
        name = self._collection()
        if name is None:
            return super().do_GET()
        if name not in COLLECTIONS:
            return self._json(404, {'error': 'unknown collection'})
        with LOCK:
            db = read_db()
        default = None if name == 'author' else []
        self._json(200, db.get(name, default))

    def do_PUT(self):
        name = self._collection()
        if name not in COLLECTIONS:
            return self._json(404, {'error': 'unknown collection'})
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8'))
        except (ValueError, UnicodeDecodeError):
            return self._json(400, {'error': 'invalid JSON'})
        with LOCK:
            db = read_db()
            db[name] = data
            write_db(db)
        self._json(200, {'ok': True})

    def do_POST(self):
        if self._collection() != 'reset':
            return self._json(404, {'error': 'not found'})
        with LOCK:
            shutil.copy(SEED_PATH, DB_PATH)
        self._json(200, {'ok': True})


class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    try:
        with Server(('127.0.0.1', PORT), Handler) as httpd:
            print(f'CampusBazaar is running at: http://localhost:{PORT}/index.html')
            print('Data is saved in db.json — press Ctrl+C to stop.')
            httpd.serve_forever()
    except OSError:
        print(f'Port {PORT} is already in use — edit PORT at the top of serve.py and try again.')
        sys.exit(1)
    except KeyboardInterrupt:
        print('\nServer stopped.')
