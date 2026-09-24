"""Serve Next's out/ export with extensionless HTML routes on loopback."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class ExportHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        target = super().translate_path(path)
        if not Path(target).exists() and Path(target + ".html").is_file():
            return target + ".html"
        return target

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", default="out")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(ExportHandler, directory=args.directory))
    print(f"Serving {Path(args.directory).resolve()} at http://127.0.0.1:{args.port}", flush=True)
    server.serve_forever()
