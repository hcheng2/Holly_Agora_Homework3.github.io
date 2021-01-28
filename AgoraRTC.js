let handleFail = function(err){
    console.log("Error: ", err);
};

let participants = "";
let numRemote = 0;

let remoteContainer1 = document.getElementById("remote-stream");
let remoteContainer2 = document.getElementById("remote-stream2");
let remoteContainer3 = document.getElementById("remote-stream3");

function addParticipant(name){
  //  username = document.getElementById("username").value;
    participants += name;
    participants += "<br>";
    document.getElementById("participants").innerHTML = participants;    
}
 
function addVideoStream(elementId){
    let streamDiv = document.createElement("div");
    streamDiv.id = elementId;
    if (numRemote == 0)
        remoteContainer1.appendChild(streamDiv);
    else if (numRemote == 1)
        remoteContainer2.appendChild(streamDiv);
    else if (numRemote == 2)
        remoteContainer3.appendChild(streamDiv);
    numRemote++;
};

document.getElementById("join").onclick = function(){
    let channelName = document.getElementById("channel").value;
    let username = document.getElementById("username").value;
    let appID = "2400b34296a64a5295504ebc9e2a741f";
    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"    
    });
    
    client.init(appID);
  
    username = document.getElementById("username").value;
    addParticipant(username);

    client.join(null, channelName, username, ()=>{
        let localStream = AgoraRTC.createStream({
            audio: true,
            video: true,
        });
        localStream.init(()=>{
            localStream.play("self-stream");
            client.publish(localStream, handleFail);
        }, handleFail);
    }, handleFail);

    client.on("stream-added", function(evt){
        client.subscribe(evt.stream, handleFail);
        let name = evt.stream.getElementById("username").value;
        console.log(name);
        addParticipant(name);
    });
    client.on("stream-subscribed", function(evt){
        let stream = evt.stream;
        let streamId = String(stream.getId());
        addVideoStream(streamId);
        stream.play(streamId);
    });
}
