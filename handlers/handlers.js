const moment = require('moment-timezone');

async function checkLoginCode(loginCode) {
    try {
        const response = await fetch(`http://localhost:8000/users?loginCode=${loginCode}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        if (users.length > 0) {
            return {
                success: true,
                data: users[0]
            };
        } else {
            return {
                success: false
            };
        }
    } catch (error) {
        return {
            success: false
        };
    }
}

async function register(req, res) {
    const { login_code, full_name } = req.body;
    if (!login_code || !full_name) {
        let data = { "success": false, "error": "Missing parameter!" }
        return res.json(data);
    }
    try {
        const response = await fetch(`http://localhost:8000/users?loginCode=${login_code}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        if (users.length > 0) {
            let data = {
                success: false,
                error: "Login code already exists!"
            };
            return res.json(data);
        } else {
            try {
                const response = await fetch('http://localhost:8000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ loginCode: login_code, fullName: full_name, login:true })
                });
                if (response.ok) {
                    let data = {
                        success: true,
                        loginCode: login_code
                    };
                    return res.json(data);
                }
                else {
                    let data = {
                        success: false,
                        error: "Registration failed, please try again!"
                    };
                    return res.json(data);
                }
            } catch (error) {
                let data = {
                    success: false,
                    error: error
                };
                return res.json(data);
            }
        }
    } catch (error) {
        let data = {
            success: false,
            error: "Registration failed, please try again!"
        };
        return res.json(data);
    }
}

async function login(req, res) {
    const { login_code } = req.body;
    if (!login_code) {
        let data = { "success": false, "error": "Missing parameter!" }
        return res.json(data);
    }
    try {
        const response = await fetch(`http://localhost:8000/users?loginCode=${login_code}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        if (users.length > 0) {
            if (!users[0].login) {
                const updateResponse = await fetch(`http://localhost:8000/users/${users[0].id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: true })
                });
                if (updateResponse.ok) {
                    let data = {
                        success: true,
                        loginCode: login_code
                    };
                    return res.json(data);
                }
                else {
                    let data = {
                        success: false,
                        error: "Error updating login status!"
                    };
                    return res.json(data);
                }
            }
            else {
                let data = {
                    success: false,
                    error: "The user is logged in elsewhere!"
                };
                return res.json(data);
            }

        } else {
            let data = {
                success: false,
                error: "Wrong login code!"
            };
            return res.json(data);
        }
    } catch (error) {
        let data = {
            success: false,
            error: "Registration failed, please try again!"
        };
        return res.json(data);
    }
}

async function Logout(req, res) {
    const { login_code } = req.body;
    if (!login_code) {
        let data = { "success": false, "error": "Missing parameter!" }
        return res.json(data);
    }
    try {
        const response = await fetch(`http://localhost:8000/users?loginCode=${login_code}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        if (users.length > 0) {
            if (users[0].login) {
                const updateResponse = await fetch(`http://localhost:8000/users/${users[0].id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: false })
                });
                if (updateResponse.ok) {
                    let data = {
                        success: true,
                    };
                    return res.json(data);
                }
                else {
                    let data = {
                        success: false,
                        error: "An error occurred updating logout status!"
                    };
                    return res.json(data);
                }
            }
            else {
                let data = {
                    success: true
                };
                return res.json(data);
            }

        } else {
            let data = {
                success: true,
            };
            return res.json(data);
        }
    } catch (error) {
        let data = {
            success: false,
            error: "An error occurred updating logout status!"
        };
        return res.json(data);
    }
}

async function listAllQuestions(req, res) {
    try {
        const response = await fetch('http://localhost:8000/questions');
        const data = await response.json();
        let allQuestions = data.reverse().map(questions => {
            const { answers, point, ...rest } = questions;
            return rest;
        });
        res.render('questionPage', { questions: allQuestions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Server Error');
    }
}

function createQuestionView(req, res) {
    res.render('createQuestionPage')
}

async function createQuestion(req, res) {
    const { content, firstAnswer, secondAnswer, thirdAnswer, fourthAnswer, point } = req.body;
    if (!content || !firstAnswer || !secondAnswer || !thirdAnswer || !fourthAnswer || !point) {
        let data = { "success": false, "error": "Missing parameter!" }
        return res.json(data);
    }
    try {
        try {
            answers = [firstAnswer, secondAnswer, thirdAnswer, fourthAnswer];
            const response = await fetch('http://localhost:8000/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, answers, point })
            });
            if (response.ok) {
                let data = {
                    success: true,
                };
                return res.json(data);
            }
            else {
                let data = {
                    success: false,
                    error: "Posting failed questions!"
                };
                return res.json(data);
            }
        } catch (error) {
            let data = {
                success: false,
                error: error
            };
            return res.json(data);
        }
    } catch (error) {
        let data = {
            success: false,
            error: "Posting failed questions!"
        };
        return res.json(data);
    }
}

function joinQuestionView(req, res) {
    res.render('joinQuestionPage');
}

async function viewQuestion(req, res) {
    let questionData = {};
    let historyAnswer = {};
    const idQuestion = req.params.idQuestion;
    try {
        const response = await fetch(`http://localhost:8000/questions?id=${idQuestion}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const questions = await response.json();
        if (questions.length > 0) {
            let { point, ...rest } = questions[0];
            questionData = rest;
        }
        else {
            res.status(404).send('Sorry, page not found!');
        }
    } catch (error) {
        res.status(500).send(error);
    }
    try {
        const response = await fetch(`http://localhost:8000/answers?questionId=${idQuestion}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const answers = await response.json();
        if (answers.length > 0) {
            historyAnswer = answers;
            historyAnswer.sort((a, b) => compareTimeStrings(a.time, b.time));
            let bestOfAnswer = historyAnswer.find(item => item.correct === true);
            if (!bestOfAnswer) {
                res.render('viewQuestionPage', { idQuestion, questionData, historyAnswer: await formatHistoryAnswer(historyAnswer), bestOfAnswer: "", bestInterrogation: await getBestInterrogation(idQuestion) })
            }
            else {
                bestOfAnswer = await loginCodeToName(bestOfAnswer.loginCode) + " answered correctly and fastest at the time " + bestOfAnswer.time;
                res.render('viewQuestionPage', { idQuestion, questionData, historyAnswer: await formatHistoryAnswer(historyAnswer), bestOfAnswer, bestInterrogation: await getBestInterrogation(idQuestion) })
            }
        }
        else {
            res.render('viewQuestionPage', { idQuestion, questionData, historyAnswer: [], bestOfAnswer: "", bestInterrogation: await getBestInterrogation(idQuestion) })
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}

function compareTimeStrings(timeString1, timeString2) {
    function parseDateTime(dateTimeStr) {
        const [time, date] = dateTimeStr.split(' ');
        const [hours, minutes, seconds] = time.split(':');
        const [day, month, year] = date.split('-');

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    const dateTime1 = parseDateTime(timeString1);
    const dateTime2 = parseDateTime(timeString2);

    if (dateTime1 < dateTime2) {
        return -1;
    } else if (dateTime1 > dateTime2) {
        return 1;
    } else {
        return 0;
    }
}

async function checkAnswered(data) {
    try {
        const response = await fetch(`http://localhost:8000/answers?loginCode=${data.loginCode}&questionId=${data.idQuestion}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const answers = await response.json();
        if (answers.length > 0) {
            return {
                success: true,
                data: answers[0]
            };
        } else {
            return {
                success: false
            };
        }
    } catch (error) {
        return {
            success: false
        };
    }
}

async function formatHistoryAnswer(historyAnswer) {
    const promises = historyAnswer.map(async (answer) => {
        const name = await loginCodeToName(answer.loginCode);
        const correctness = answer.correct ? "correctly" : "incorrectly";
        return `${name} answered ${correctness} at a time ${answer.time}`;
    });

    return Promise.all(promises);
}

async function loginCodeToName(loginCode) {
    try {
        const response = await fetch(`http://localhost:8000/users?loginCode=${loginCode}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        if (users.length > 0) {
            return users[0].fullName;
        } else {
            return "unclear";
        }
    } catch (error) {
        return "unclear";
    }
}

async function checkAnswer(data) {
    try {
        const response = await fetch(`http://localhost:8000/answers?loginCode=${data.loginCode}&questionId=${data.idQuestion}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const answers = await response.json();
        if (answers.length > 0) {
            return { success: false };
        } else {
            const questionResponse = await fetch(`http://localhost:8000/questions?id=${data.idQuestion}`, {
                method: 'GET'
            });
            if (!questionResponse.ok) {
                throw new Error(`HTTP error! Status: ${questionResponse.status}`);
            }
            const questions = await questionResponse.json();
            if (questions.length > 0) {
                let point = questions[0].point;
                let letCorrect = point == data.point;
                let timeNow = getVietnamDateTime();
                try {
                    const updateResponseA = await fetch('http://localhost:8000/answers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ questionId: data.idQuestion, loginCode: data.loginCode, correct: letCorrect, time: timeNow, interrogation_time:data.interrogation })
                    });
                    if (updateResponseA.ok) {
                        let bestInterr = await getBestInterrogation(data.idQuestion);
                        let new_row = `${await loginCodeToName(data.loginCode)} answered ${letCorrect ? "correctly" : "incorrectly"} at a time ${timeNow}`;
                        return { success: true, newRow: new_row, bestOfAnswer: letCorrect ? await loginCodeToName(data.loginCode) + " answered correctly and fastest at the time " + timeNow : "",bestInterr };
                    }
                    else {
                        return { success: false };
                    }
                } catch (error) {
                    return { success: false };
                }
            }
        }
    } catch (error) {
        return { success: false };
    }
}

function getVietnamDateTime() {
    return moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD-MM-YYYY');
}

async function getBestInterrogation(questionId) {
    const url = 'http://localhost:8000/answers';  

    try {
        const response = await fetch(url);
        const answers = await response.json();

        const relevantAnswers = answers.filter(answer => answer.questionId === questionId && answer.correct === true);

        if (relevantAnswers.length === 0) {
            return ""; 
        }

        let bestAnswer = relevantAnswers[0];
        for (let i = 1; i < relevantAnswers.length; i++) {
            if (relevantAnswers[i].interrogation_time < bestAnswer.interrogation_time) {
                bestAnswer = relevantAnswers[i];
            }
        }

        return await loginCodeToName(bestAnswer.loginCode) + " had the fastest time to answer questions at " + bestAnswer.interrogation_time + "s";
    } catch (error) {
        return "";
    }
}



module.exports = {
    checkLoginCode: checkLoginCode,
    register: register,
    login: login,
    listAllQuestions: listAllQuestions,
    createQuestionView: createQuestionView,
    Logout: Logout,
    createQuestion: createQuestion,
    joinQuestionView: joinQuestionView,
    viewQuestion: viewQuestion,
    checkAnswered: checkAnswered,
    checkAnswer: checkAnswer
};
