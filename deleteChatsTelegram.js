/**
 * @ create right click event
 */
const rightClick = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    view: window
});

async function deleteChat(count = 1) {
    for (let i = 0; i < count; i++) {
        let elements = document.querySelectorAll(
            ".chatlist a"
        );
        let menu = await openMenu(elements[i]);
        let delBtn = menu.querySelectorAll(".tgico-delete")[0];
        let diloge = await openDialog(delBtn);
        let delChat = await doDelete(diloge);
        console.log(`Chat ${elements[i].querySelector('.peer-title').innerText} ${i + 1} Delete status ${delChat ? "True" : "False"}`);
    }


    function openDialog(btn) {
        return new Promise((resolve, reject) => {
            btn.click();
            setTimeout(() => {
                let popup = document.querySelector(".popup-delete-chat.active");
                if (!popup) {
                    btn.click();
                    setTimeout(() => {
                        resolve(document.querySelector(".popup-delete-chat.active"));
                    }, 1);
                } else resolve(popup);
            }, 1);
        });
    }

    function openMenu(el) {
        return new Promise((resolve, reject) => {
            el.dispatchEvent(rightClick);
            setTimeout(() => {
                let menu = document.querySelector(".contextmenu");
                if (!menu) {
                    el.dispatchEvent(rightClick);
                    setTimeout(() => {
                        resolve(document.querySelector(".contextmenu"));
                    }, 1);
                } else resolve(menu);
            }, 1);
        });
    }

    function doDelete(dialog) {
        return new Promise((resolve) => {
            if (dialog) {
                let deleteBtn = dialog.querySelector(".danger");
                if (deleteBtn) deleteBtn.click();
                setTimeout(() => {
                    resolve(true);
                }, 300);
            } else resolve(false);
        });
    }

}

const delInt = setInterval(deleteChat, 4000);

//clearInterval(delInt); use it to stop interveal