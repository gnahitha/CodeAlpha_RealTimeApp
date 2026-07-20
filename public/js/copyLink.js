const copyBtn = document.getElementById("copyLinkBtn");

if(copyBtn){

    copyBtn.addEventListener("click", async () => {

        const link = window.location.href;

        try{

            await navigator.clipboard.writeText(link);

            copyBtn.innerHTML = "✅ Copied";

            setTimeout(()=>{

                copyBtn.innerHTML = "📋 Copy Link";

            },2000);

        }catch(err){

            alert("Unable to copy link");

        }

    });

}