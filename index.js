const fs = require('fs');
const http = require('http');
const url = require('url')

///////////////////////////////////////////////////////////
//files

//blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written')

//non -blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err => {
//                 console.log('your file has been written😇')
//             })
//         })
//     })
// })
// console.log('read this file');

///////////////////////////////////////////////////////////
//server

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if (!product.organic)output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
    
}

const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/template/templateCard.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataobj = JSON.parse(data)

const server = http.createServer((req,res) => {
    const pathName = req.url;
    if( pathName === '/' || pathName === '/overview'){
        res.writeHead(200, { 'content-type': 'text/html'});

        const cardsHtml = dataobj.map(element => replaceTemplate(tempCard, element)).join('');
        const card = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
        // console.log(cardsHtml);
        res.end(card)
        // res.end(tempOverview)
    }else if( pathName === '/product'){
        res.end('this is the product page')
    }else if (pathName === '/api'){
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);
    }else{
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('page not found')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening too request on port 8000!🏡');
})

