module.exports = (io) => {
//   let documents = [];
//
//   io.on('connection', (socket) => {
//
//     console.log('Client connected to socket!');
//
//     socket.on('joinRoom', (data) => {
//       socket.join(data.docId);
//       let docOpen = false;
//       documents.forEach((doc) => {
//         if (doc.docId === data.docId) {
//           docOpen = true
//         } if (doc.collaborators) {
//           doc.collaborators.push(data.user)
//         } else {
//           doc.collaborators = [data.user];
//         }
//         console.log(doc.collaborators)
//       });
//     });
//     if (!docOpen){
//       documents.push({ docId: data.docId, collaborators: [data.user] });
//     }
//   });
//
//     socket.on('leaveRoom', (data) => {
//       socket.leave(data.docId);
//       documents.forEach((doc) => {
//
//       })
//     })
// }



io.on('connection', (socket) => {
  let documents = [];

  socket.on('join', (data) => {
    socket.join(data.docId);
    console.log('Joined document.');
    documents.push(data.docId);
    console.log(documents);
    })

  socket.on('leave', (data) => {
    documents.forEach((docId) => {
      if (docId === data.docId) {
        socket.leave(data.docId);
        console.log('Left room.');
      }
    })
  })

  socket.on('editorChange', (data) => {
    console.log('editor change', data);
    socket.broadcast.to(data.docId).emit('editorChange', data);
  })
})
