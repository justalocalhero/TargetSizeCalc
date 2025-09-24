var textElement = document.getElementById("inputArea")
textElement.addEventListener("input", handleInput)
var printArea = document.getElementById("printArea")

const sizes = [42, 32, 24, 18, 12]
node = {}

function handleInput()
{
    let value = textElement.value
    if(isNaN(value)) return;
    if(value < 12) return;
    if(value > 200) return;
    handleSolutions(value)
}

function handleSolutions(value)
{
    let output = findOptimal(value);
    printArea.innerHTML = "";

    printArea.appendChild(document.createElement("div")).innerHTML = `Solutions with remainder of ${output.remainder} inches:`
    printArea.appendChild(document.createElement("br"))


    for(solution of output.solutions)
    {    
        let first = true
        let line = printArea.appendChild(document.createElement("div"))
        for(value of solution)
        {
            console.log(value)
            if(!first)line.innerText += " + "
            line.innerText += value + " in "
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

    popRef(head)

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
        if(!collectionContainsSimilar(solutions, solution)) solutions.push(solution)
    }

    return {solutions: solutions, remainder: minRemaining}
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