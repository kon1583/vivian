//******************
//商品の詳細表示
//******************
function f_showItem(product_id, type) {
  
  if(type == 1) {
    //ポップアップで開く場合
    wUrl = "./?mode=ITEM&p_id=" + product_id;
    gf_OpenNewWindow(wUrl, "Item", "width=600:height=500");
    
  } else {
    //同じウインドウで開く場合
    wUrl = "./?mode=ITEM2&p_id=" + product_id;
    location.href=wUrl;
  }
}

//***********************
//商品の詳細表示(情報のみ)
//***********************
function f_showItem2(product_id) {
  wUrl = "./?mode=ITEM&state=INFO&p_id=" + product_id;
  gf_OpenNewWindow(wUrl, "Item", "width=600:height=500");
}


//************************
//個数が０だったらアラート
//************************
function f_check_num(select) {
  if(select.value == 0) {
    window.alert("個数を選択してください。");
    return false;
  } else {
    return true;
  }
}

//***********************************
//個数UP・DOWNボタン処理
//***********************************
function f_change_num2(select, pType, pMinNum, pStockNum) {
  if( select.value.match(/[^0-9]/)){ select.value = pMinNum; return; }
  wNum = parseInt(select.value);
  if (pType == "0" && wNum > pMinNum) {
    select.value = String(wNum-1);
  }
  if (pType == "1") {
    if (pStockNum) {
      if (wNum >= pStockNum) return;
    }
    select.value = String(wNum+1);
  }
}
//***********************************
//元のウィンドウを操作
//***********************************
function f_opener_move(URL) {
  if(opener.closed) {
    NewWin=window.open("","blank");
    NewWin.location.href=URL;
  } else {
    opener.location.href=URL;
  }
  window.close();
}

function f_opener_reload() {
  opener.location.reload();
  window.close();
}

//**************************************************************************************
////////////////////   指定サイズでウィンドウを開き、センターに表示   //////////////////
//--------------------------------------------------------------------------------------
//      gf_OpenNewWindow(URL,NAME,SIZE)
//    SIZEは、"width=800:height=600"のように入力してください
//**************************************************************************************
function gf_OpenNewWindow(pURL,pName,pSize){
  var wWidth,wHeight;
  var wSize,wFeatures;
  var wLeft,wTop,PositionX,PositionY;
  
  wWidth = window.screen.availWidth/2;
  wHeight = window.screen.availHeight/2;
  wSize = pSize.split(":");
  wLeft = wSize[0].split("=");
  wTop = wSize[1].split("=");
  PositionX = wWidth-wLeft[1]/2;
  PositionY = wHeight-wTop[1]/2;
  
  wFeatures = wSize+",left="+PositionX+",top="+PositionY;
  wWindow = window.open(pURL,pName,wFeatures+",scrollbars=yes,status=yes,resizable=yes");
  
  wWindow.focus();
}


function empt_cart() {
  if(confirm ("カートの中身を空にしてもよろしいですか？")) {
    document.location.href = "./?mode=cart&empt=1";
  }
}

//***********************************
//メールマガジンの登録・解除
//***********************************
function mm_send(Type) {
  wMsg   = "";
  if (Type == 'INS') {
    wMsg   = "メルマガに登録します。よろしいですか？";
  } else {
    wMsg = "メルマガを解除します。よろしいですか？";
  }

  ob = eval("document.frm.email");

  // 入力チェック
  if (ob.value == "") { alert ("メールアドレスを入力してください。"); ob.focus(); return; }
  // Email形式チェック
  if (!validate_email(ob.value)) { alert ("メールアドレスの形式が正しくありません。"); ob.focus(); return; }

  if(confirm (wMsg)) {
    document.frm.type.value  = Type;
    document.frm.email.value = ob.value;
    document.frm.submit();
  }
}

//***********************************
//Emailの形式チェック
//***********************************
function validate_email(Email) {

  if(!Email.match(/^[a-zA-Z0-9./?+_-]+\@[a-zA-Z0-9._-]+$/)) {
    return false;
  }
  return true;
}

