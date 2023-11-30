export default (req,res)=>{
    const tab_contenant_nombres_premiers=[2]
    let current_number_tested=3
    let test=0
    while (tab_contenant_nombres_premiers.length<1000){
        test=0
        tab_contenant_nombres_premiers.forEach((nb_premier_deja_detecte)=>{
            if(current_number_tested%nb_premier_deja_detecte==0){
                test=1
            }
        })
        if(test==0){
            tab_contenant_nombres_premiers.push(current_number_tested)
        }
        current_number_tested+=1
    }
    res.json(tab_contenant_nombres_premiers)
}