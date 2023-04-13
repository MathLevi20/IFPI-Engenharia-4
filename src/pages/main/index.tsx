import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Question = {
  id: string;
  option1: string;
  option2: string;
  vote1: number;
  vote2: number;
};

function Choice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [count, setCount] = useState(Number);
  const [isVisible, setIsVisible] = useState(false);
  const [reload, setReload] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cronos-api.onrender.com/question');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [reload]);
  const handleReload = () => {
    setReload(String(Math.random()))
  };

  const  handleOption = async ( value:number) => {
    setCount(value); 
    console.log(value)
    // Update count with a new value
  };

  const handleVote = async (id: string, option: number) => {
    console.log(id,option)
    try {
      await axios.patch('https://cronos-api.onrender.com/vote', { id, option });
      // Atualiza o estado das questões após o voto ser registrado com sucesso
      const updatedQuestions = questions.map(question => {
        if (question.id === id) {
          if (option === 1) {
            return { ...question, vote1: question.vote1 + 1 };
          } else if (option === 2) {
            return { ...question, vote2: question.vote2 + 1 };
          }
        }
        console.log(question)

        return question;
      });
     setQuestions(updatedQuestions);
     setIsVisible(true);
   
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-r from-purple-800 to-blue-500 min-h-screen">
      <h1 className="text-center text-3xl font-bold text-white mb-10">Choice</h1>
      {questions.map(question => (
        <div key={question.id} className="bg-gray-900 p-8 rounded-lg mb-10">
          <div className="grid grid-cols-2 text-center gap-6">
            <div>
              <span className="text-gray-300 font-semibold">Option 1:</span>
              <span className="text-gray-100 ml-1">{question.option1}</span>
            </div>
            <div>
              <span className="text-gray-300 font-semibold">Option 2:</span>
              <span className="text-gray-100 ml-1">{question.option2}</span>
            </div>
            <div className={!isVisible ? "hidden" : "block"}>
              <span className="text-gray-300 font-semibold">Vote 1:</span>
              <span className="text-gray-100 ml-1">{question.vote1}</span>
            </div>
            <div className={!isVisible ? "hidden" : "block"}>
              <span className="text-gray-300 font-semibold">Vote 2:</span>
              <span className="text-gray-100 ml-1">{question.vote2}</span>
            </div>
            <div className="">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleOption(1)}
              >
                Select 1
              </button>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ml-3"
                onClick={() => handleOption(2)}
              >
                Select 2
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className={`${isVisible ? "hidden" : "block"} bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-10 rounded`}
              onClick={() => handleVote(question.id, count)}
            >
              Votar
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ml-3"
              onClick={handleReload}
            >
              Recarregar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  
      }  

export default Choice;
