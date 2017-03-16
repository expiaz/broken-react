<?php

function verifyPwd(){
    if(!isset($_POST["pwd"]))
        return;
    $pwd = htmlspecialchars($_POST["pwd"]);
    $pwdLengh = strlen($pwd);
    if($pwdLengh < 6){
        return "Password trop court";
    }
    else if($pwdLengh <= 12){
        return "Bon password";
    }
    else{
        return "Ok";
    }
}


?>

<form action="" method="post">
    <input type="password" name="pwd">
    <input type="submit" value="sub"/>
    <?=verifyPwd()?>
</form>
