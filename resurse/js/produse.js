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
        }

    }
})