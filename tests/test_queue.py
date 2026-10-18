import sys, os, time, threading, tempfile, subprocess, json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root))
os.environ['CLIPXY4ALL_JOB_DB']=str(Path(tempfile.mkdtemp())/'jobs.sqlite3')
from app import jobs,job_store
from app.models import GenerateRequest
started=[]; release={}; lock=threading.Lock()
def worker(j):
    with lock: started.append(j.req.upload_name)
    while not release.get(j.req.upload_name,False) and not j.cancelled: time.sleep(.02)
    if j.req.upload_name=='Failure': raise ValueError('deliberate test failure')
    j.finish([])
jobs._run_pipeline=worker
jobs.initialize()
def submit(name):
    j=jobs.create_job(GenerateRequest(upload_id='test',upload_name=name));jobs.start_job(j);return j
def wait(fn):
    deadline=time.time()+10
    while not fn():
        assert time.time()<deadline,'timed out'
        time.sleep(.03)
a,b,c=submit('A'),submit('B'),submit('C')
wait(lambda:len(started)==2)
assert set(started)=={'A','B'} and c.status=='queued'
a.cancel();wait(lambda:'C' in started)
assert b.status=='running' and a.status=='cancelled'
release['C']=True;wait(lambda:c.status=='done')
f=submit('Failure');wait(lambda:'Failure' in started);release['Failure']=True
wait(lambda:f.status=='error');assert b.status=='running'
release['B']=True;wait(lambda:b.status=='done')
d=submit('Restart');wait(lambda:d.status=='running')
q=submit('Restart2');wait(lambda:q.status=='running');r=submit('QueuedRestart')
# Read persisted snapshots in a fresh interpreter, as after abrupt process exit.
code='from app import jobs; jobs.initialize(); import json; print(json.dumps(jobs.list_jobs())); jobs.shutdown()'
out=subprocess.check_output([sys.executable,'-c',code],cwd=root,text=True)
snaps={j['name']:j['status'] for j in json.loads(out)}
assert all(snaps[x]=='interrupted' for x in ['Restart','Restart2','QueuedRestart'])
assert snaps['B']=='done' and snaps['A']=='cancelled' and snaps['Failure']=='error'
jobs.shutdown()
print(json.dumps({'result':'PASS','tests':['two concurrent jobs','third queued','cancel isolated','queue advances','failure isolated','history survives restart','active and queued become interrupted'],'history':snaps},indent=2))
