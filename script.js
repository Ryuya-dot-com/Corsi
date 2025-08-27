const mainArea = document.getElementById("mainArea");
let participantName = "";
let startTime = "";
let trialLog = [];
let maxBlockCount = 2;     // 現在の課題数（最初は2）
let errorCount = 0;
let corsiSpan = 2;
let trialN = 0;
let trialStartTime = 0;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('entryForm').onsubmit = function(e){
    e.preventDefault();
    participantName = document.getElementById('participantName').value.trim();
    if(!participantName){ alert("名前を入力してください。"); return; }
    startTime = new Date().toLocaleString('sv-SE').replace(' ', '_'); // 例: 2025-08-01_18:41:20
    trialLog = [];
    maxBlockCount = 2;
    errorCount = 0;
    corsiSpan = 2;
    trialN = 0;
    document.getElementById('entryScreen').classList.remove('active');
    mainArea.classList.add('active');
    showInstructions();
  };
});

function showInstructions(){
  mainArea.innerHTML = `
    <b>テストの説明</b><br>
    <div style="margin:20px 0 24px 0; font-size:1.12em;">
    9つのブロックが表示されます。<br>
    いくつかのブロックが順番に黄色く光ります。<br>
    <b>合図の後、同じ順番でブロックをクリック</b>してください。<br>
    順番は徐々に長くなります。2回連続で間違えるか、9個まで成功したら終了です。<br>
    <br>準備ができたら「スペースキー」を押してください。
    </div>
    <div class="blockgrid">${[...Array(9)].map((_,i)=>`<button class="blockbtn" disabled></button>`).join("")}</div>
  `;
  window.onkeydown = function(e){
    if(e.code==="Space"){
      window.onkeydown = null;
      showCountdown();
    }
  };
}

function showCountdown(){
  let c = 3;
  mainArea.innerHTML = `<div class="countdown">${c}</div>`;
  let interval = setInterval(()=>{
    c--;
    if(c>0){
      mainArea.innerHTML = `<div class="countdown">${c}</div>`;
    }else{
      clearInterval(interval);
      doTrial();
    }
  }, 900);
}

async function doTrial(){
  trialN++;
  // 順番ランダム生成（重複なし）
  let sequence = [];
  let available = [...Array(9)].map((_,i)=>i);
  for(let i=0;i<maxBlockCount;i++){
    let idx = Math.floor(Math.random()*available.length);
    sequence.push(available[idx]);
    available.splice(idx,1);
  }

  // ブロックを一斉表示
  mainArea.innerHTML = `
    <div class="blockgrid" id="blockgrid">
      ${[...Array(9)].map((_,i)=>`<button class="blockbtn" id="block${i}"></button>`).join("")}
    </div>
    <div id="statusText"></div>
  `;
  await sleep(600);

  // 順番にハイライト
  for(let i=0;i<sequence.length;i++){
    document.getElementById(`block${sequence[i]}`).classList.add("highlight");
    await sleep(750);
    document.getElementById(`block${sequence[i]}`).classList.remove("highlight");
    await sleep(300);
  }

  document.getElementById("statusText").innerHTML = `<span style="color:#198e0f;font-weight:bold;font-size:1.15em;">開始！</span>`;
  await sleep(350);
  
  // 試行開始時刻を記録
  trialStartTime = Date.now();

  // 入力受付
  let input = [];
  for(let i=0;i<9;i++){
    let btn = document.getElementById(`block${i}`);
    btn.disabled = false;
    btn.onclick = ()=>{
      if(input.length<sequence.length && !btn.classList.contains("selected")){
        input.push(i);
        btn.classList.add("selected");
        
        // 必要な数のブロックが押されたら自動的に終了
        if(input.length===sequence.length){
          // 回答完了時刻を記録
          let responseTime = Date.now() - trialStartTime;
          finishTrial(sequence, input, responseTime);
        }
      }
    };
  }
}

function finishTrial(sequence, input, responseTime){
  for(let i=0;i<9;i++) document.getElementById(`block${i}`).disabled = true;
  
  let correct = input.length===sequence.length && input.every((v,i)=>v===sequence[i]);
  if(correct){
    corsiSpan = maxBlockCount;
    maxBlockCount++;
    errorCount = 0;
  }else{
    errorCount++;
  }
  
  trialLog.push({
    participant: participantName,
    datetime: startTime,
    trial: trialN,
    blockCount: sequence.length,
    presentedSeq: sequence.map(x=>x+1).join("-"),
    responseSeq: input.map(x=>x+1).join("-"),
    correct: correct ? 1 : 0,
    responseTime: responseTime  // ミリ秒単位で記録
  });
  
  showTrialFeedback(correct);
  setTimeout(()=>{
    if(errorCount>=2 || maxBlockCount>9){
      showResult();
    }else{
      showCountdown();
    }
  }, 1300);
}

function showTrialFeedback(correct){
  let emoji = correct ? "😊" : "😢";
  let txt = correct ? "正解です！" : "間違いです。";
  document.getElementById("statusText").innerHTML = `<span class="smiley">${emoji}</span> <span style="font-size:1.18em">${txt}</span>`;
}

function showResult(){
  let maxSpan = corsiSpan;
  let correctN = trialLog.filter(x=>x.correct).length;
  let totalN = trialLog.length;
  mainArea.innerHTML = `
    <div class="resultblock"><b>【結果】</b><br>
    <div>最大スパン：<span class="score">${maxSpan}</span></div>
    <div>正答試行数：<span class="score">${correctN}</span> / ${totalN}</div>
    </div>
    <button class="btn" onclick="downloadResultCSV()">CSVでダウンロード</button>
    <button class="btn" onclick="location.reload()">もう一度やる</button>
  `;
}

function downloadResultCSV() {
  const header = ["participant","datetime","trial","blockCount","presentedSeq","responseSeq","correct","responseTime"];
  const rows = trialLog.map(row=>[
    row.participant,row.datetime,row.trial,row.blockCount,row.presentedSeq,row.responseSeq,row.correct,row.responseTime
  ]);
  let csv = header.join(",") + "\n" + rows.map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `corsi_results_${participantName}_${startTime.replace(/[^0-9]/g,"")}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 500);
}

function sleep(ms) { return new Promise(r=>setTimeout(r, ms)); }
