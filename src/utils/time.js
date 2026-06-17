function formatarSegundos(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;

  const partes = [];
  if (horas > 0) partes.push(`${horas}h`);
  if (minutos > 0) partes.push(`${minutos}min`);
  if (secs > 0 || partes.length === 0) partes.push(`${secs}s`);

  return partes.join(' ');
}

function formatarMinutos(minutos) {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  if (horas <= 0) return `${mins} min`;
  return `${horas}h ${mins}min`;
}

function agoraISO() {
  return new Date().toISOString();
}

function diffSegundos(inicio, fim = new Date()) {
  const a = new Date(inicio).getTime();
  const b = new Date(fim).getTime();
  return Math.max(0, Math.floor((b - a) / 1000));
}

module.exports = {
  formatarSegundos,
  formatarMinutos,
  agoraISO,
  diffSegundos
};