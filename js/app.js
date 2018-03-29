golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');


/*FORM FOR ADDING NEW NOTE*/
/*(done)*/
function openAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'block';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'none';
    removeNotes();
}

/*(done)*/
function closeAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'none';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'block';
    loadNotes();
}

/*opening form for adding new note ПЕРЕДЕЛАТЬ*/
document.getElementsByClassName('btn-add-note')[0].addEventListener('click', function(){
    openAddNoteForm();
});

/*sending note to the database (done 0.8)*/
document.getElementsByClassName('frm-add-note')[0].addEventListener('submit', function(e){
    e.preventDefault();
    if(wif){
        sendAddNoteForm()
    }else{
        auth(sendAddNoteForm);
    }
    return false;
    
});

function sendAddNoteForm(){
    var title = document.getElementById('formHeader').value;
    var body = document.getElementById('formText').value;
    var type = getIndexFromName(findCheckedRadio('formRadio',4));
    console.log('title: '+title+' body: '+body+' type: '+type);
    //console.log(window.wif);
    /**
    * comment() добавить пост
    * @param {Base58} wif - приватный posting ключ
    * @param {String} parentAuthor - для создания поста, поле пустое
    * @param {String} parentPermlink - главный тег
    * @param {String} author - автор поста
    * @param {String} permlink - url-адрес поста
    * @param {String} title - заголовок поста
    * @param {String} body - текст поста
    * @param {String} jsonMetadata - мета-данные поста (изображения, и т.д.)
    */
    //wif - 5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU";
    //      5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU
    //var wif = "5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU";
    /*var parentAuthor = '';
    var parentPermlink = 'tag';
    var author = 'golos-test';
    var permlink = 'test-url';
    //var title = 'titleTest';
    //var body = 'bodyTest';
    var jsonMetadata = '{}';
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            console.log('comment', result);
        }
        else console.error(err);
    });    */
    //TODO добавление записи на страницу
    
    
    //SHOW MESSAGE ABOUT SUCCESSFUL SENDING
    closeAddNoteForm();
}

/*cancelling of adding form for creating feedback (done)*/
document.getElementsByClassName('btn-add-note-cancel')[0].addEventListener('click',function(){
    closeAddNoteForm();
});


/*NOTES*/
document.addEventListener('DOMContentLoaded', loadNotes);
//document.getElementsByClassName('btn-load-notes')[0].addEventListener('click', loadNotes);

/*Loading notes (DONE)*/
//gathering notes from the database - from branch 'recently added' - searching with 'author'
//TODO добавить permlink в атрибут записи
function loadNotes(){
    changeTheme();
    var data = [];
    var query = {
        select_authors: ['vgolos4'],
        limit: 100,
    };
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            result.forEach(function(item) {
                //console.log(item);
                data.push(item.id);
                data.push(item.title);
                data.push(item.body);
                data.push(2);//count of comments
                data.push(item.author);
                data.push(item.created);
                data.push(3);//likes
                data.push(10);//dislikes
                data.push(item.permlink);
                
                createNote(data);
                data = [];
            });
        }
        else console.error(err);
    });
    
    //создание записей через массив с данными (для работы без интернета)
    /*for(var i=0;i<2;i++){
        data.push(i+1);
        data.push('Lorem ipsum dolor sit amet, consectetur');
        data.push('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, praesentium, animi! Cumque ipsam corporis unde a laboriosam sequi accusamus natus doloremque aliquid, suscipit delectus, sint recusandae fugit quasi, expedita velit.');
        data.push(2);//count of comments
        data.push('Name Surname');//author
        data.push('may-28-2018');//created
        data.push(3);//likes
        data.push(10);//dislikes
        createNote(data);
        data = [];
    }*/
}

/*Remove one note with the given noteId*/
function removeNote(noteId){
    document.getElementById(noteId).remove();
}

/*Removing all the notes to open the form for adding new feedback*/
function removeNotes(){
    Array.from(document.getElementsByClassName('note')).forEach(function(item){
        item.remove();
    });
}

/*Opening all the comments and the form, removing all the rest*/
function expandNote(noteId){
    removeNotesExceptOne(noteId);
    loadComments(noteId);
    createCommentForm(noteId);
}

/*Event of expanding note - action like a button 'Comments'*/
function addEventForNoteHeader(noteId){
    var thisHeader = getNoteHeader(noteId);
    thisHeader.addEventListener('click',function(){
        if(thisHeader.getAttribute('data-permission')=='true'){
            thisHeader.setAttribute('data-permission','false');
            getBtnShowComment(noteId).setAttribute('data-state','hide');
            expandNote(noteId);
        }
    });
    
} 


/*COMMENTS*/
/*Events for buttons inside note to manipulate comments (done)*/
function addEventsForCommentButtons(noteId){
    
    getBtnShowComment(noteId).addEventListener('click',function(){
        if(this.getAttribute('data-state') == 'show'){
            this.setAttribute('data-state','hide');
            getNoteHeader(noteId).setAttribute('data-permission','false');
            expandNote(noteId);            
        }else{
            removeNote(noteId);
            loadNotes();
        }
    });
}

/*Loading comments from database - (done 0.5)*/
function loadComments(noteId){
    var data = [];
    //запрос в базу
    
    //цикл для работы без интернета
    for(var i=0;i<2;i++){
        data.push('c'+(i+1));
        data.push(noteId);
        data.push('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, praesentium, animi! Cumque ipsam corporis unde a laboriosam sequi accusamus natus doloremque aliquid.');
        data.push('Name Surname');//author
        data.push('may-28-2018');//created
        data.push(3);//likes
        data.push(10);//dislikes
        createComment(data);
        data = [];
    }
}

/*Removing all existing comments from note width given ID (done)*/
function hideComments(noteId){
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        item.remove();    
    });
}

/*event for button 'Comment' (btn-add-comment-done) - sending comment to the database (done)*/
function addEventsForComDone(noteId){    
    getBtnAddComDone(noteId).addEventListener('click',function(){
        var body = getTxtareaCom(noteId).value;
        console.log('comment to note '+noteId+'. Body: '+body);
        
        var data = [];
        data.push(findUniqueIdForComment(noteId));
        data.push(noteId);
        data.push(body);
        data.push('Name Surname');//author
        data.push('may-28-2018');//created
        data.push(0);//likes
        data.push(0);//dislikes
        createComment(data);
        data = [];
        
        //updating a count of comments
        var commentCount = Number(getLblCommentCount(noteId).innerHTML);
        getLblCommentCount(noteId).innerHTML = ++commentCount;
        getTxtareaCom(noteId).value = '';
    });
}


/*LIKES & DISLIKES*/
/*Events for these buttons in notes */
function addEventsForNoteLikes(noteId){
    getBtnLikeNote(noteId).addEventListener('click',function(){
        var likes = Number(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = ++likes;
        console.log('like to note '+noteId);
    });
    getBtnDislikeNote(noteId).addEventListener('click',function(){
        var dislikes = Number(this.nextElementSibling.innerHTML);
        this.nextElementSibling.innerHTML = ++dislikes;
        console.log('like to note '+noteId);
    });
}

/*Events for these buttons in comments HERE*/
function addEventsForComLikes(noteId, comId){
    getBtnLikeCom(noteId,comId).addEventListener('click',function(){
        
        var likes = Number(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = ++likes;
        console.log('like to note '+noteId+' comment '+comId);
        
    });
    getBtnDislikeCom(noteId,comId).addEventListener('click',function(){
        var dislikes = Number(this.nextElementSibling.innerHTML);
        this.nextElementSibling.innerHTML = ++dislikes;
        console.log('dislike to note '+noteId+' comment '+comId);
    });
}


/*other functions*/
function findUniqueIdForComment(noteId){
    var blockComments = getBlockComments(noteId);
    var flag = false;
    var newId = Number(blockComments.children[blockComments.childElementCount-1].getAttribute('id').substr(1));
    while(flag==false){
        flag=true;
        for(var i=0; i<blockComments.childElementCount; i++){
            if(Number(blockComments.children[i].getAttribute('id').substr(1)) == newId){
                flag = false;
                newId = (Number(newId)+1);
            }
        }    
    }
    return 'c'+newId;
}

function removeNotesExceptOne(noteId){
    Array.from(document.getElementsByClassName('note')).forEach(function(item){
        if(item.getAttribute('id')!=noteId) item.remove();
    });
}

function findCheckedRadio(name,count){
    for(var i=0;i<count;i++){
        var radioButton = document.getElementById(name+i);
        if(radioButton.checked == true){
            return radioButton.getAttribute("id");  
        }
    }
    return null;
}

/*cuts an index from the given id*/
function getIndexFromName(name){
    var indexLength = name.length - 9;
    return name.slice(-indexLength);
}

function getBlockFormAddComment(noteId){
    return document.getElementById(noteId).children[document.getElementById(noteId).childElementCount-1];
}
function getBlockComments(noteId){
    console.log(document.getElementById(noteId));
    console.log(document.getElementById(noteId).getElementsByClassName('comments')[0]);
    return document.getElementById(noteId).getElementsByClassName('comments')[0];
}
function getBtnShowComment(noteId){
    return document.getElementById(noteId).getElementsByClassName('btn-show-comments')[0];
}
function getNoteHeader(noteId){
    return document.getElementById(noteId).getElementsByTagName('h3')[0];
}
function getBtnAddComDone(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('btn-add-com-done')[0];
}
function getNoteControls(noteId){
    return document.getElementById(noteId).getElementsByClassName('controls')[0];
    //.children[0].children[0].children[1]   ;
}
function getBtnLikeNote(noteId){
    return getNoteControls(noteId).getElementsByClassName('btn-like')[0];
}
function getBtnDislikeNote(noteId){
    return getNoteControls(noteId).getElementsByClassName('btn-dislike')[0];
}
function getComment(noteId, comId){
    //работает
    var comment;
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        if(item.getAttribute('id')==comId){
            comment = item;
        }
    });
    return comment;
}

function getBtnLikeCom(noteId, comId){
    return getComment(noteId,comId).getElementsByClassName('btn-com-like')[0];
}
function getBtnDislikeCom(noteId, comId){
    return getComment(noteId,comId).getElementsByClassName('btn-com-dislike')[0];
}
function getTxtareaCom(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('txt-add-com')[0];
}
function getLblCommentCount(noteId){
    return getBtnShowComment(noteId).children[0];
}

/*forming the note, filling it up and placing into the wrapper to the bottom*/
function createNote(data){
    var note = document.createElement('div');
    note.className = 'row note';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.innerHTML = "<div class='container body-note tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3 data-permission='true'>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments' data-state='show'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='date'><small>"+data[5]+"</small></div><div class='likes'><span>"+data[6]+"</span><button type='button' class='btn btn-success btn-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-dislike'><i class='fas fa-thumbs-down'></i></button><span>"+data[7]+"</span></div></div></div></div></div><div class='container comments'></div>";
    document.getElementsByClassName('wrapper')[0].appendChild(note);
    console.log('note has been created: id = '+data[0]);
    addEventsForCommentButtons(data[0]);
    addEventsForNoteLikes(data[0]);
    addEventForNoteHeader(data[0]);
}

/*forming comment, filling it up, placing inside of the note*/
function createComment(data){
    var comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',data[0]);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>"+data[2]+"</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[3]+"</h6></div><div class='date'><small>"+data[4]+"</small></div><div class='likes'><span>"+data[5]+"</span><button type='button' class='btn btn-success btn-com-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-com-dislike'><i class='fas fa-thumbs-down'></i></button><span>"+data[6]+"</span></div></div></div></div></div>";
    getBlockComments(data[1]).appendChild(comment);
    console.log("comment has been created: "+data[1]+" "+data[0]);
    addEventsForComLikes(data[1],data[0]);
}
function createCommentForm(noteId){
    var commentForm = document.createElement('div');
    commentForm.className = 'container frm-add-com';
    commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control txt-add-com' id='commentBody' rows='3' placeholder='Type your comment here' required></textarea></div><button type='submit' class='btn btn-primary btn-add-com-done'><span class='icon-checkmark'></span> Submit</button></form></div></div>";
    document.getElementById(noteId).appendChild(commentForm);
    addEventsForComDone(noteId);
}//вставлять целиком в конец .note


/*copied scripts for buttons in nav*/
async function getUrls() {
    if (wif == '') {
        await auth();
    } else {
        golos.api.getContent(username, constPermlik, function(err, result) {
            result.id == 0 ? swal({
                html: document.getElementById('no-records-IPFS').innerHTML
            }) : getPostJson(username, constPermlik, result);
            if (err) swal(err);
        });
    }
}
document.getElementById('golos-urls').onclick = getUrls;
document.getElementById('aboutGolosFeedbackCallBtn').addEventListener('click', () => {
        swal({
            title: document.getElementById('about-html-title').innerHTML,
            html: document.getElementById('about-html').innerHTML,
            type: 'info',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success btn-lg',
            confirmButtonText: document.getElementById('button-cool').innerHTML,
            position: 'top',
            showCloseButton: true
        });
    }, false);
document.getElementById('integration').addEventListener('click', function(e) {
        swal({
            title: 'About integration!',
            html: document.getElementById('integration-html').innerHTML,
            type: 'info',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success btn-lg',
            confirmButtonText: '<span class="icon-checkmark"></span> Cool!',
            position: 'top',
            showCloseButton: true
        })
    })
