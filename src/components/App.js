import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Result from "./Result";
import Question from "./Question";
// import { Check } from "@material-ui/icons";
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar'
// import TypoGraphy from '@material-ui/core/Typography'
// import data from "./data"

let ansArray = []


function App() {

  const [data, setData] = React.useState([])
  const [optionsArray, setOptionsArray] = useState([])


  React.useEffect(() => {

    const baseURL = "https://opentdb.com/api.php?amount=2&category=9&difficulty=easy&type=multiple"
    axios.get(baseURL).then((resp) => {

      let responseData = resp.data.results;
      setData(responseData);

      // Shuffle Option Array => optionsArray
      responseData.map((eachOptions) => {

        let option = [...(eachOptions.incorrect_answers), eachOptions.correct_answer]
        let shuffleOption = []
        let i = 0;

        while (i < 4) {
          let k = Math.floor(Math.random() * 4);

          if (!shuffleOption.includes(option[k])) {
            shuffleOption.push(option[k])
            i = i + 1;
          }
        }
        return setOptionsArray(pre => {
          return [...pre, shuffleOption]
        })
      })
    })
    // Ended Shuffling

  }, []);


  console.log(data);

  const [start, setStart] = useState(true)
  const [index, setIndex] = useState(0)  //Create Index 
  // const [ansArray, setAnsArray] = useState([])
  // const [check, setCheck] = useState("")

  const startQuiz = () => {  //Quiz Started
    setStart(false)
  }

  function handleNext(index, checked) { // Next
    console.log("n");
    console.log(checked);
    if (ansArray[index] >= 0) {
      // setAnsArray(pre => {
      //   pre[index] = checked
      //   return [...pre]
      // })
      ansArray[index] = checked
      console.log("o");
    } else {
      // setAnsArray(pre => {
      //   return [...pre, checked]
      // })
      ansArray.push(checked)
      console.log("f");
    }
    // setCheck(checked)
    setIndex(index + 1)
    console.log(ansArray);
  }

  function handlePrevious(index) { //Previous
    console.log("p");
    setIndex(index - 1)
  }
  const [result, setResult] = useState(false)
  const [score, setScore] = useState(0)

  function handleSubmit(checked) {  //Submit
    console.log("s");
    ansArray.push(checked)
    console.log(ansArray);
    setResult(true)
    setStart(true)

    ansArray.filter((each, index) => {
      return optionsArray[index][each] === data[index].correct_answer && setScore(pre => pre + 5)
    })

  }


  return <div>
    <Header />
    {(start && !result) && <Home startQuiz={startQuiz} />}
    {(!start && !result) && <Question
      key={index}
      question={data[index].question}
      option={optionsArray}
      index={index}
      check={ansArray}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleSubmit={handleSubmit}
    />}
    {result && <Result ansArray={ansArray} data={data} options={optionsArray} score={score} />}
    <Footer />

  </div>

}

export default App;

