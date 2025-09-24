var inchesElement = document.getElementById("inputArea")
var feetElement = document.getElementById("feetInputArea")
inchesElement.addEventListener("input", handleInput)
feetElement.addEventListener("input", handleInput)
var printArea = document.getElementById("printArea")
var feetValue = 0;
var inchesValue = 0;

const sizes = [42, 32, 24, 18, 12]
node = {}

function handleInput()
{
    printArea.innerHTML = "";
    let feet = feetElement.value;
    let inches = inchesElement.value;
    if(isNaN(feet)) feet = 0;
    if(isNaN(inches)) inches = 0;
    let feetConverted = Number(feet);
    let inchesConverted = Number(inches);
    if(feetConverted > 10000) return;
    if(inchesConverted > 10000) return;
    let totalValue = 12*feetConverted + inchesConverted;
    if(isNaN(totalValue)) return;
    if(totalValue < 12) return;
    feetValue = feetConverted;
    inchesValue = inchesConverted;
    handleSolutions(totalValue)
}

function handleSolutions(value)
{
    let output = findOptimal(value);
    printArea.innerHTML = "";

    let div = printArea.appendChild(document.createElement("div"));
    div.innerHTML = `Solutions for `
    if(feetValue > 0) div.innerHTML += `${feetValue} feet `
    if(inchesValue > 0) div.innerHTML +=`${inchesValue} inches `
    div.innerHTML += `with remainder of ${output.remainder} inches:`
    
    printArea.appendChild(document.createElement("br"))


    for(solution of output.solutions)
    {    
        let first = true
        let line = printArea.appendChild(document.createElement("div"))
        for(value of solution)
        {
            if(!first)line.innerText += ` +  `
            line.innerText += `(${value.count} x ${value.value} in)`
            if(first) first = false
        }
        printArea.appendChild(document.createElement("br"))
    }

}

function getNode(parent, remaining, value)
{
    return {parent: parent, remaining: remaining, value:value, children:[],isHead:false}
}

function populate(count)
{
    let head = {remaining: count, children:[], isHead:true}
    let currentNode = head;

    while(currentNode.remaining > 114)
    {
        let child = getNode(currentNode, currentNode.remaining - 42, 42);
        currentNode.children.push(child);
        currentNode = child;
    }

    popRef(currentNode)

    return head
}

function popRef(node)
{
    for (let size of sizes)
    {
        if(node.remaining >= size)
        {
            child = getNode(node, node.remaining - size, size)
            node.children.push(child)
            popRef(child)
        }
    }
}


function findOptimal(count)
{
    let tree = populate(count)
    let roots = []
    traverseToRoots(tree, roots)

    let minRemaining = 99999999999;

    for(root of roots)
    {
        if(root.remaining < minRemaining) minRemaining = root.remaining;
    }

    let optimized = []

    for(root of roots)
    {
        if(root.remaining == minRemaining) optimized.push(root);
    }

    let solutions = []

    for(optim of optimized)
    {
        let solution = []
        let currentNode = optim;
        while(!currentNode.isHead)
        {
            solution.push(currentNode.value)
            currentNode = currentNode.parent;            
        }

        solution.sort()
        solution.reverse()
        if(!collectionContainsSimilar(solutions, solution)) solutions.push(solution)
    }

    let consolidatedSolutions = []
    for(solution of solutions)
    {
        consolidatedSolutions.push(collapseArray(solution))
    }

    return {solutions: consolidatedSolutions, remainder: minRemaining}
}

function collectionContainsSimilar(collection, array)
{
    for(item of collection)
    {
        if(similarArrays(item, array)) return true
    }

    return false
}

function similarArrays(arr1, arr2)
{
    if(arr1.length != arr2.length)
        return false
    for(let i = 0; i < arr1.length; i++)
    {
        if(arr1[i] != arr2[i]) return false
    }
    return true
}

function collapseArray(arr)
{
    let solution = []

    let currentNode = {value: -1, count: 0}

    for (item of arr)
    {
        if(currentNode.value != item)
        {
            currentNode = {value: item, count: 1}
            solution.push(currentNode)
        }
        else
        {
            currentNode.count++;
        }
    }

    return solution;
}

function traverseToRoots(node, roots) {
    if(node.children.length > 0)
    {
        for(child of node.children)
        {
            traverseToRoots(child, roots);
        }
    }
    else
    {
        roots.push(node)
    }
}