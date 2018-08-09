module.exports = (io) => {
  let documents = [];

  io.on('connection', (socket) => {

    console.log('Client connected to socket!');

    socket.on('joinRoom', (data) => {
      socket.join(data.docId);
      let docOpen = false;
      documents.forEach((doc) => {
        if (doc.docId === data.docId) {
          docOpen = true
        } if (doc.collaborators) {
          doc.collaborators.push(data.user)
        } else {
          doc.collaborators = [data.user]
        }
        console.log(doc.collaborators)
      });
    });
    if (!docOpen){
      documents.push({ docId: data.docId, collaborators: [data.user] });
    }
  });

    socket.on('leaveRoom', (data) => {
      socket.leave(data.docId);
      documents.forEach((doc) => {

      })
    })
}
