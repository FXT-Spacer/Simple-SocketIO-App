const socketIo = require('socket.io');
const handlers = require('../handlers/handlers');
const initIo = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  io.on('connection', (socket) => {
    console.log('More client connected');
    updateVisitorCount(io);
    socket.on('send_login_code', async (loginCode) => {
      let checkResult = await handlers.checkLoginCode(loginCode);
      if (checkResult.success) {
        socket.emit('result_check_login', { success: true, data: checkResult.data });
      } else {
        socket.emit('result_check_login', { success: false });
      }
    });

    socket.on('check_answered', async (data) => {
      let checkAnswered = await handlers.checkAnswered(data);
      if (checkAnswered.success) {
        socket.emit('answered', { loginCode: data.loginCode, idQuestion: data.idQuestion, answered: true, correct: checkAnswered.data.correct, time: checkAnswered.data.time })
      }
    });

    socket.on('post_answer', async (data) => {
      let checkAnswer = await handlers.checkAnswer(data);
      if (checkAnswer.success) {
        io.emit('new_answer', { newRow: checkAnswer.newRow, loginCode: data.loginCode, idQuestion: data.idQuestion, bestOfAnswer: checkAnswer.bestOfAnswer, bestInterr: checkAnswer.bestInterr })
        let checkAnswered = await handlers.checkAnswered(data);
        if (checkAnswered.success) {
          socket.emit('answered', { loginCode: data.loginCode, idQuestion: data.idQuestion, answered: true, correct: checkAnswered.data.correct, time: checkAnswered.data.time })
        }
      }
    })

    socket.on('add_question', (data) => {
      console.log(data.addQuestionNotice);
      io.emit('add_new_question', { notice: data.addQuestionNotice });
    })

    socket.on('disconnect', () => {
      console.log('More client disconnected');
      updateVisitorCount(io);
    });
  });
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

function updateVisitorCount(io) {
  const connectedCount = io.engine.clientsCount;
  io.emit('client_count', connectedCount);
}

module.exports = { initIo, getIo };
