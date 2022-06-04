
import {useState} from 'react'
import './App.css'
import Hangman from './Hangman';
import data from './data'
import stages from './stages'

const App = () => {
  let [targetUnits, setTargetUnits] = useState([])
  let [targetWords, setTargetWords] = useState([])
  let [qType, setQType] = useState('eng')
  let [question, setQuestion] = useState('')
  let [answer, setAnswer] = useState('')
  let i = 0

  let [chars, setChars] = useState()
  let [display, setDisplay] = useState()
  let [wrong, setWrong] = useState([])
  let [blankCount, setBlankCount] = useState(0)
  let [lifeCount, setLifeCount] = useState(6)

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
  
  const updateWords = (units) => {
    let words = units.reduce(function (acc, unit) {
      return acc.concat(allWordsGroupByUnit[unit])
    }, [])
    setTargetWords(words)
  }

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
    updateWords(units)
    reset()
  }

  const qTypeHandler = (e) => {
    setQType(e.target.value)
    reset()
  }

  const startHandler = () => {
    if (targetWords.length === 0) {
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
      document.querySelector('#answer').style.visibility = 'hidden'
    } else if (qType === 'chi') {
      setQuestion(word.chi)
      setAnswer(word.eng) 
      document.querySelector('#answer').style.visibility = 'hidden'
    } else if (qType === 'hangman') {
      let chars = word.eng.split('')
      let display = chars.reduce(
        (acc, l) => {
            acc.push('_')
            return acc
        }, [])
      setQuestion(word.eng)
      setChars(chars)
      setDisplay(display)
      setBlankCount(chars.length)
      setWrong([])
    }
  }

  const settingHandler = () => {
    document.querySelector('#setting').style.visibility = 'visible'
  }

  document.addEventListener('keyup', (e) => {
      e.preventDefault()
      if (blankCount === 0 || lifeCount === 0) {
          return
      }
      let char = e.key
      let displaySet = new Set(display)
      if (displaySet.has(char)) {
        return
      }
      let charSet = new Set(chars)
      if (charSet.has(char)) {
          for (let i = 0; i < chars.length; i++) {
              if (chars[i] === char) {
                  display[i] = char
                  blankCount--
              }
          }
          setDisplay(display)
          setBlankCount(blankCount)
      } else {
          console.log(char);
          console.log(wrong);
          // wrong.push(char)
          // setWrong(wrong)
          lifeCount--
          setLifeCount(lifeCount)
      }
    })

  return (
    <div className="App">
      <div id='error'> </div>

      <div id='main'>
        {qType === 'hangman' && question && 
          <div id='hangman'>
            {/* <div id='message'>hangman {question}</div> */}
            <div>{display.join(' ')}</div>
            <pre>{stages[lifeCount]}</pre>
            <div>{wrong.join(', ')}</div>
          </div>
        }
        {qType !== 'hangman' && 
          <div className='row'>
            <div id='question' className='col'>{question}</div>
            <div id='answer' className='col'>{answer}</div>
          </div>
        }
      </div>

      <div id='start'>
        <button className="btn btn-primary" onClick={startHandler}>開始</button>
      </div>
      <div id='going'>
        <button id={i++} className="btn btn-primary" onClick={answerHandler}>看答案</button>
        <button id={i++} className="btn btn-primary" onClick={nextHandler}>下一題</button>
        <button id={i++} className="btn btn-primary" onClick={endHandler}>結束</button>
      </div>

      <button className="btn btn-secondary" onClick={settingHandler}>設定</button>
      <div id='setting'>
        <span className='title'>範圍：</span> 
        {allUnits.map(unit => {return (
          <button id={i++} className="btn btn-success" value={unit} onClick={unitHandler}>{unit}</button>
        )})}
      
        <span className='title'>題目類型：</span> 
        <button id={i++} className="btn btn-warning" value='eng' onClick={qTypeHandler}>英文(翻中)</button>
        <button id={i++} className="btn btn-warning" value='chi' onClick={qTypeHandler}>中文(翻英)</button>
        <button id={i++} className="btn btn-warning" value='hangman' onClick={qTypeHandler}>hangman</button>
      </div>
    </div>
  );
}

export default App;
