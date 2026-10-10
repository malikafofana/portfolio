"""Local retrieval API with exact source extracts and bounded inputs."""
import json
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from search_engine import SearchEngine
ROOT=Path(__file__).resolve().parent
ENGINE=SearchEngine(ROOT/'corpus')
class Handler(BaseHTTPRequestHandler):
    def respond(self,status,data,kind='application/json'):
        body=data if isinstance(data,bytes) else json.dumps(data,ensure_ascii=False,allow_nan=False).encode()
        self.send_response(status);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(body)));self.send_header('X-Content-Type-Options','nosniff');self.end_headers();self.wfile.write(body)
    def do_GET(self):
        if self.path=='/':self.respond(200,(ROOT/'dashboard.html').read_bytes(),'text/html; charset=utf-8')
        elif self.path=='/health':self.respond(200,{'status':'ok','chunks':len(ENGINE.chunks),'mode':'local_demo'})
        elif self.path=='/api/report':
            try:self.respond(200,json.loads((ROOT/'artifacts/benchmark.json').read_text()))
            except FileNotFoundError:self.respond(503,{'error':'Run python search_engine.py first'})
        else:self.respond(404,{'error':'Not found'})
    def do_POST(self):
        if self.path!='/api/search':return self.respond(404,{'error':'Not found'})
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=8192:raise ValueError('Body must contain 1–8192 bytes')
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict):raise ValueError('Expected JSON object')
            config=json.loads((ROOT/'artifacts/config.json').read_text())
            self.respond(200,ENGINE.answer(data.get('query'),config['threshold'],data.get('mode','hybrid')))
        except (ValueError,TypeError,KeyError) as error:self.respond(400,{'error':str(error)})
        except FileNotFoundError:self.respond(503,{'error':'Run python search_engine.py first'})
if __name__=='__main__':
    print('Demo: http://127.0.0.1:8012');ThreadingHTTPServer(('127.0.0.1',8012),Handler).serve_forever()
