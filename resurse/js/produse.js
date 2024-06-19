
window.addEventListener('load', function() {
    document.getElementById("inp-pret").onchange = function() {
        document.getElementById("infoRange").innerHTML =` (${this.value})`
    }

    this.document.getElementById("filtrare").onclick = function() {
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();

        let radiobuttons = document.getElementsByName("gr_rad");
        let val_corzi;
        for (let r of radiobuttons) {
            if (r.checked) {
                val_corzi = r.value;
                break;
            }
        }

        var corzi_a, corzi_b;
        if(val_corzi != "toate") {
            [corzi_a, corzi_b] = val_corzi.split(":");
            corzi_a = parseInt(corzi_a);
            corzi_b = parseInt(corzi_b);
        }

        let val_pret=document.getElementById("inp-pret").value;

        let val_categ=document.getElementById("inp-categorie").value;

        var produse=document.getElementsByClassName("produs");

        for(let prod of produse){
            prod.style.display="none";
            let nume= prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();

            let cond1 = (nume.startsWith(val_nume));

            let corzi = parseInt(prod.getElementsByClassName("val-corzi")[0].innerHTML);

            let cond2 = (val_corzi == "toate" || corzi >= corzi_a && corzi <= corzi_b);

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);

            let cond3 = (pret >= val_pret);

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;

            let cond4 = (val_categ == "toate" || categorie == val_categ);

            if (cond1 && cond2 && cond3 && cond4){
                prod.style.display="block";
            }
        }
    }

    document.getElementById("resetare").onclick= function(){
                
        document.getElementById("inp-nume").value="";
        
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        for (let prod of produse){
            prod.style.display="block";
        }
    }
    // SI AICI!
    function sorteaza (semn){
        var produse=document.getElementsByClassName("produs");
        let v_produse=Array.from(produse)
        v_produse.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML)
            let pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML)
            if (pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        })
        console.log(v_produse)
        for (let prod of v_produse){
            prod.parentNode.appendChild(prod)
        }

    }
    // AICI!
    document.getElementById("sortCrescNume").onclick= function(){
        sorteaza(1)
    }
    document.getElementById("sortDescrescNume").onclick= function(){
        sorteaza(-1)
    }

    window.onkeydown=function(e){
        if (e.key=="c" && e.ctrlKey){
            var suma=0;
            var produse=document.getElementsByClassName("produs");
            for (let produs of produse){
                var stil=getComputedStyle(produs)
                if (stil.display!="none"){
                    suma+=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
                }
            }
            if (!document.getElementById("par_suma")){
                let p= document.createElement("p")
                p.innerHTML=`Produsele de pe pagina costa: ${suma}`;
                p.id="par_suma";
                container=document.getElementById("produse")
                container.insertBefore(p,container.children[0])
                setTimeout(function(){
                    var pgf=document.getElementById("par_suma")
                    if(pgf)
                        pgf.remove()
                }, 1500)
            }

        }
    }


})


document.addEventListener('DOMContentLoaded', function() {
    const produse = document.querySelectorAll('.produs');
    const categorii = {};

    produse.forEach(prod => {
        const categorie = prod.getAttribute('data-categorie');
        const pret = parseFloat(prod.getAttribute('data-pret'));

        if (!categorii[categorie] || categorii[categorie].pret > pret) {
            categorii[categorie] = { element: prod, pret: pret };
        }
    });

    for (const cat in categorii) {
        const produsIeftin = categorii[cat].element;
        const marker = document.createElement('div');
        marker.textContent = 'Cel mai ieftin produs';
        marker.style.color = 'red';
        marker.style.fontWeight = 'bold';
        produsIeftin.querySelector('.info-prod').appendChild(marker);
        produsIeftin.style.border = '6px solid red';
    }
});