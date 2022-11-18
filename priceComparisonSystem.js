//retrieve the saved arrays from the local storage & assign an empty array to priceQuotes if no data found
const priceQuotes = localStorage.getItem("priceQuotes")
? JSON.parse(localStorage.getItem("priceQuotes"))
: []

let input = ""
//ask the user for input
do {input = prompt("INSERT and QUERY")
  } while (input.length === 0)

//check if the input is an INSERT or a QUERY
if (input.includes("INSERT")){
     //remove "INSERT " from the input
    input = input.replace("INSERT ", "")
    //split the input into a list 
    input = input.split(" ")
    //INSERT {[company] [prefix] [price]} into priceQuotes
    priceQuotes.push({company: input[0], prefix: input[1], price: input[2]})
    //store the array in the local storage
    localStorage.setItem("priceQuotes", JSON.stringify(priceQuotes))
}
//check if the input is a QUERY 
else if (input.includes("QUERY")){
    //remove "QUERY " from the input
    input = input.replace("QUERY ", "")

    //filter unique values of companies in priceQuotes
    const companies = [...new Set(priceQuotes.map(item => item.company))]

    const priceQuotesBycompanies = []
    //filter the price quotes by the company and separate them into different list items
    companies.forEach(company => {
        let arr = priceQuotes.filter((item) => item.company === company)
        priceQuotesBycompanies.push(arr)
    })

    const bestQuotes = []
    //go through the price quotes of each company
    priceQuotesBycompanies.forEach(quotes => {
        let prefixList = []
        let longestMatch      
        
        //go through each quote of the price quotes
        quotes.forEach(quote => {
            let matchingPrefix = "" 
            //go through each number of the prefix
            for (let i = 0, j = 0; (i <= quote.prefix.length && j <= input.length); i++, j++){
                //if the num of the input does not match with the num of prefix, leave the loop
                if  (quote.prefix[i] != input[j]) {
                    break
                }
                matchingPrefix += input[j]
                }
            //if the prefix matches, add it to the matching prefix list
            if (matchingPrefix){
            prefixList.push(matchingPrefix)
            }
        })
        //if there are matching prefix(s), find the longest matching prefix 
        if (prefixList.length !== 0) {
            longestMatch = prefixList.reduce((a, b) => a.length > b.length ? a : b)
            //add the array {[company] [prefix] [price]} of the longest matching prefix to bestQuotes
            bestQuotes.push(quotes.find(i => i.prefix === longestMatch))
            }
        })

    //if bestQuotes is empty (no matching prefix found), return the QUERY result with NA
    if(bestQuotes.length === 0) {
        console.log(`${input} NA`)
    }

    else {
    //find the cheapest price in bestQuotes
    const cheapestPrice = Math.min(...((Object.values(bestQuotes).map(({price}) => [price]))))

    //find the matching price quote array of the cheapest price
    const theBestOffer = bestQuotes.find(quote => quote.price == cheapestPrice)
    
    //return the QUERY result with the best offer
    console.log(`${input} ${theBestOffer.company} ${theBestOffer.prefix} ${theBestOffer.price}`)
    }

}
else {console.log(`You have entered an invalid command`)}