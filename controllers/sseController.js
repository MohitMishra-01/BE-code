let clients = [];

const eventsHandler = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
};

const sendNewOrder = (newOrder) => {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(newOrder)}\n\n`)
  );
};

module.exports = { eventsHandler, sendNewOrder };
