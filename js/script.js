// fetch("https://restcountries.com/v3.1/all")
// .then(res => res.json())
// .then(data => console.log(data));

const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const form = document.getElementById('myForm');
const topicEl = document.querySelector('.topic');
const nounEl = document.querySelector('#noun');
const footEl = document.querySelector('.foot');
const verbDiv = document.querySelector('#verb-list');
const bodyEl = document.querySelector('#body');
const activeBtn = document.querySelector('#changer');
const contents = document.querySelectorAll('.noun-con');


class Meaning{
    async getWord(){
        let input = document.querySelector('.search-bar').value;
        this.getMeaning(input)
    }
    async getMeaning(word){
        try{
            const res = await fetch(baseUrl+word);
            const data = await res.json();
            // console.log(data);
            Ui.displayTopic(data[0]);
            Ui.filterData(data[0]);
        }catch(error){
            console.log(error)
        }
    }
}

class Ui{
    static displayTopic(data){
        const {word,phonetic,phonetics} = data;
        const audio = phonetics.filter(el =>{
          if(el.audio != ""){
            return el
          }
        })
        let topic = `
        <div class="container">
        <div class="row d-flex align-items-center">
            <div class="col">
                <h2>${word}</h2>
                <p id="verbEx">${phonetic}</p>
            </div>
            <div class="col-1">
                <i id="playBtn" class="fa fa-play" aria-hidden="true"></i>
            </div>
        </div>
        <audio id="audio" controls style="display:none" >
            <source src=${audio[0].audio} type="audio/mpeg"> 
        </audio>
        </div>
        `;
        topicEl.innerHTML = topic;
        const topicEx = document.querySelectorAll("#verbEx");
        this.hideContent(topicEx);
        const playBtn = document.getElementById("playBtn");
        playBtn.onclick = () =>{
            document.getElementById('audio').play();
        }
    }
    static filterData(data){
        const meanings = data.meanings;
        let results = meanings.filter(word=>{
            if(word.partOfSpeech == "noun"){
                this.displayNoun(word)
            }else if(word.partOfSpeech == "verb"){
                this.displayVerb(word);
            }else{
                return
            }
        })
    }
    static displayNoun(results){
        const definitions = results.definitions;
        const synonyms = results.synonyms;
        let result = definitions.map(item=>{
            let mean = `
                <li>
                <dl>
                    <dt>${item.definition}</dt>
                    <dd id="verbEx">${item.example}</dd>
                  </dl>
                </li>`;
            return mean;
        })
        let syno = synonyms.map(item =>{
            let synonym = `
            <h4>${item}</h4>`;
            return synonym ;
        })
        result = result.join(" ");
        nounEl.innerHTML = result;
        syno = syno.join(" ");
        footEl.innerHTML = syno;
        const nounEx = document.querySelectorAll("#verbEx");
        this.hideContent(nounEx);
    }
    static displayVerb(results){
        const define = results.definitions;
        let result = define.map(item => {
            return `<li>
                        <dl>
                            <dt>${item.definition}</dt>
                            <dd id="verbEx">${item.example}</dd>
                        </dl>
                    </li>`
        })
        result = result.join(" ");
        verbDiv.innerHTML = result;
        const verbEx = document.querySelectorAll("#verbEx");
        this.hideContent(verbEx);
    }
    static hideContent(data){
        for(const el of data){
            if(el.innerText == "undefined"){
                el.style.display = "none";
            }
        }
    }
    hideContainer(){
        for(const content of contents){
            content.style.display = "block";
        }
    }

}
form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    let meaning = new Meaning();
    let ui = new Ui();
    ui.hideContainer();
    meaning.getWord();
})

class Dark{
    darkMode(){
        activeBtn.addEventListener('click',()=>{
            bodyEl.classList.toggle("active");
        })
    }
}
window.addEventListener('load',()=>{
    let dark = new Dark();
    dark.darkMode();
})
