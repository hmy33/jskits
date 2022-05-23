
import {useState} from 'react'
import './App.css'
import data from './data'
const App = () => {
  let [targetUnits, setTargetUnits] = useState([])
  let [targetWords, setTargetWords] = useState([])
  let [qType, setQType] = useState('eng')
  let [question, setQuestion] = useState('')
  let [answer, setAnswer] = useState('')
  let i = 0

  const reset = () => {
    setQuestion('')
    setAnswer('') 
    document.querySelector('#start').style.display = 'block'
    document.querySelector('#going').style.display = 'none'
    document.querySelector('#error').innerHTML = ''
  }
  
  // prepare data 
  function groupBy(arr, criteria) {
    const newObj = arr.reduce(function (acc, currentValue) {
      if (!acc[currentValue[criteria]]) {
        acc[currentValue[criteria]] = [];
      }
      acc[currentValue[criteria]].push(currentValue);
      return acc;
    }, {});
    return newObj;
  }
  const allWordsGroupByUnit = groupBy(data, 'unit')
  // get all units
  const allUnits = Object.keys(allWordsGroupByUnit)

  const unitHandler = (e) => {
    let unit = e.target.value
    let units = new Set(targetUnits)
    if (units.has(unit)) {
      units.delete(unit)
    } else {
      units.add(unit)
    }
    units = [...units]
    setTargetUnits(units)
    let words = units.reduce(function (acc, unit) {
      return acc.concat(allWordsGroupByUnit[unit])
    }, [])
    setTargetWords(words)
    reset()
  }

  const qTypeHandler = (e) => {
    setQType(e.target.value)
    reset()
  }

  const startHandler = () => {
    if (targetWords.length == 0) {
      document.querySelector('#error').innerHTML = 'Please select units.'
      return
    }
    document.querySelector('#start').style.display = 'none'
    document.querySelector('#going').style.display = 'block'
    document.querySelector('#setting').style.visibility = 'hidden'
    nextHandler()
  }

  const endHandler = () => {
    reset()
  }

  const answerHandler = (e) => {
    document.querySelector('#answer').style.visibility = 'visible'
  }
  const nextHandler = () => {
    let i = Math.floor((Math.random() * targetWords.length))
    let word = targetWords[i]
    if (qType === 'eng') {
      setQuestion(word.eng)
      setAnswer(word.chi) 
    } else if (qType === 'chi') {
      setQuestion(word.chi)
      setAnswer(word.eng) 
    } else if (qType === 'ex') {
      let ex = word.ex.replace(word.eng, '_____')
      setQuestion(ex)
      setAnswer(word.eng) 
      document.querySelector('#question').style.fontSize = '5vw'
    }
    document.querySelector('#answer').style.visibility = 'hidden'
  }

  const settingHandler = () => {
    document.querySelector('#setting').style.visibility = 'visible'
  }

  return (
    <div className="App">
      <div id='error'> </div>

      <div id='main'>
        <div className='row'>
          <div id='question' className='col'>{question}</div>
          <div id='answer' className='col'>{answer}</div>
        </div>
      </div>

      <div id='setting'>
        <span className='title'>範圍：</span> 
        {allUnits.map(unit => {return (
          <button id={i++} className="btn btn-success" value={unit} onClick={unitHandler}>{unit}</button>
        )})}
      
        <span className='title'>題目類型：</span> 
        <button className="btn btn-warning" value='eng' onClick={qTypeHandler}>英文(翻中)</button>
        <button className="btn btn-warning" value='chi' onClick={qTypeHandler}>中文(翻英)</button>
        <button className="btn btn-warning" value='ex' onClick={qTypeHandler}>例句(填空)</button>
          {/* <li>聲音(翻英)</li> */}
      </div>

      <div id='start'>
        <button className="btn btn-primary" onClick={startHandler}>開始</button>
      </div>
      <div id='going'>
        {/* <button class="btn btn-primary" onClick={checkHandler}>檢查</button> */}
        <button className="btn btn-primary" onClick={answerHandler}>看答案</button>
        <button className="btn btn-primary" onClick={nextHandler}>下一題</button>
        <button className="btn btn-primary" onClick={endHandler}>結束</button>
      </div>
      <button className="btn btn-secondary" onClick={settingHandler}>設定</button>
    </div>
  );
}

export default App;
