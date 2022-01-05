import app from './app';

app.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on ${host}:${port}`);
});
