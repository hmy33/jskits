import {useState} from 'react'
import stages from './stages'

const Hangman = (props) => {
    let [chars, setChars] = useState(props.word.split(''))
    // let chars = 
    let [display, setDisplay] = useState(chars.reduce(
        (acc, l) => {
            acc.push('_')
            return acc
        }, []))
    let [wrong, setWrong] = useState([])
    let [blankCount, setBlankCount] = useState(chars.length)
    let [lifeCount, setLifeCount] = useState(6)
    
    
    // setBlankCount(chars.length)
    // blankCount = chars.length
    // display = 
    // setDisplay(display)
    document.addEventListener('keyup', (e) => {
        if (blankCount === 0) {
            return
        }
        let char = e.key
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
            wrong.push(char)
            setWrong(wrong)
            lifeCount--
            setLifeCount(lifeCount)
        }
        // if (char.match(/[a-z]/)) {
        //     console.log(char);
        // }
        // alert(e.key)
        // console.log(char);
    }, false)
    
    return (
        <div id='hangman'>
            <div id='message'>
                hangman {props.word}
            </div>
            
            <div>
                {display.join(' ')}
            </div>
            <pre>
                {stages[lifeCount]}
            </pre>
            <div>
                {wrong.join(', ')}
            </div>
        </div>
    )    
}

export default Hangman;