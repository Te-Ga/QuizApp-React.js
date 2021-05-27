function App() {
  const [quetion, setQuetion] = React.useState();
  const [correctanswer, setCorrectAnswer] = React.useState();
  const [quietionNum, setQuietionNum] = React.useState(0);
  const [displayTest, setDisplayTest] = React.useState(false);
  const [displayResult, setDisplayResult] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(true);
  const [start, setStart] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [point, setPoint] = React.useState(0);
  const [selected, setSelected] = React.useState(false);
  const [mixedAnswers, setmixedAnswers] = React.useState([]);

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleDifficulty = (e) => {
    setDifficulty(e.target.value);
  };
  //check if selected answer is correct
  // if true, add one point to the final point
  const handelClick = (e) => {
    if (e.target.innerText === correctanswer) {
      setPoint((prev) => prev + 1);
    }
    setSelected(true);
  };
  //if start button is clicked, fetch data,
  //display test and set  quetion number to 0 to track it
  React.useEffect(() => {
    setQuietionNum(0);
    FetchData();
  }, [start]);

  //fetch data-quetion,correct answer,inccorert answer.
  //shuffle all answers.
  const FetchData = async () => {
    const response = await fetch(url);
    const jsonData = await response.json();
    setQuetion(jsonData.results[quietionNum].question);
    setCorrectAnswer(jsonData.results[quietionNum].correct_answer);
    let AllAnswers = [
      jsonData.results[quietionNum].correct_answer,
      ...jsonData.results[quietionNum].incorrect_answers,
    ];
    setmixedAnswers(AllAnswers.sort(() => 0.5 - Math.random()));
  };
  //if next button is clicked fetch data to desplay next quetion
  //if last quetion hide test and show result
  const next = () => {
    if (quietionNum === 4) {
      setDisplayTest(false);
      setDisplayResult(true);
      setShowOptions(false);
      return;
    } else {
      setQuietionNum((prev) => prev + 1);
      FetchData();
    }
    setSelected(false);
  };
  //check what  category and difficulty was chosen
  //and set proper url to fetch data
  const startQuizz = () => {
    setStart(!start);
    setDisplayTest(true);
    setShowOptions(false);
    if (category === "general_knowledge") {
      if (difficulty === "easy") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
        );
      } else if (difficulty === "medium") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple"
        );
      } else if (difficulty === "hard") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=9&difficulty=hard&type=multiple"
        );
      }
    } else if (category === "animals") {
      if (difficulty === "easy") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=27&difficulty=easy&type=multiple"
        );
      } else if (difficulty === "medium") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=27&difficulty=medium&type=multiple"
        );
      } else if (difficulty === "hard") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=27&difficulty=hard&type=multiple"
        );
      }
    } else if (category === "history") {
      if (difficulty === "easy") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple"
        );
      } else if (difficulty === "medium") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=23&difficulty=medium&type=multiple"
        );
      } else if (difficulty === "hard") {
        setUrl(
          "https://opentdb.com/api.php?amount=5&category=23&difficulty=hard&type=multiple"
        );
      }
    }
  };
  //if test is finished reset all states
  //to start test again
  const reset = () => {
    setShowOptions(true);
    setDisplayResult(false);
    setQuietionNum(0);
    setPoint(0);
    setUrl("");
    setSelected(false);
    setCategory("");
    setDifficulty("");
    setmixedAnswers([]);
    setQuetion('')
  };

  return (
    <>
      <div className="app-container">
        <div className="style-Quizz">
          <header className="App-header">
            <h2>Test Your Knowledge</h2>
          </header>
          {showOptions && (
            <Options
              startQuizz={startQuizz}
              handleCategory={handleCategory}
              handleDifficulty={handleDifficulty}
            />
          )}
          {displayTest && mixedAnswers.length > 0 ? (
            <Test
              next={next}
              quetion={quetion}
              handelClick={handelClick}
              selected={selected}
              mixedAnswers={mixedAnswers}
            />
          ) : (
            <div></div>
          )}
          {displayResult && <Result point={point} reset={reset} />}
        </div>
      </div>
    </>
  );
}
//component to show final result
const Result = ({ point, reset }) => {
  return (
    <>
      <div className="final-score">Your Score: {point} Of 5</div>
      <button onClick={reset} className="restart-btn">
        Start Again
      </button>
    </>
  );
};

//component to display quetion and answers
const Test = ({ quetion, next, handelClick, selected, mixedAnswers }) => {
  return (
    <>
      <div className="test-container">
        <h5
          className="quetion"
          dangerouslySetInnerHTML={{ __html: quetion }}
        ></h5>
        <ul>
          {mixedAnswers.map((answer, index) => (
            <li
              onClick={handelClick}
              key={index}
              dangerouslySetInnerHTML={{ __html: answer }}
            ></li>
          ))}
        </ul>

        {selected && (
          <button className="next-btn" onClick={next}>
            Next
          </button>
        )}
      </div>
    </>
  );
};

//component to choose test category and difficulty
const Options = ({ startQuizz, handleCategory, handleDifficulty }) => {
  return (
    <>
      <div className="options-header">Select Category:</div>
      <select name="category" onChange={handleCategory}>
        <option value="" disabled selected>
          Please choose one
        </option>
        <option value="general_knowledge">General Knowledge</option>
        <option value="animals">Animals</option>
        <option value="history">History</option>
      </select>
      <div className="options-header">Select Difficulty:</div>
      <select name="difficulty" onChange={handleDifficulty}>
        <option value="" disabled selected>
          Please choose one
        </option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <br />
      <button className="style-btn" onClick={startQuizz}>
        Start
      </button>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
