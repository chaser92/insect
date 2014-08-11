var insectStack = [];

var logger = console.log;

var prettyPrinter = function insectPrettyPrint(spy, operation, args) {
    var indent = Array(insectStack.length).join("  ");
    var argsString = Object.keys(args).map(function(argKey) { 
        return args[argKey].toString();
    }).join(" ");
    return indent + "[Insect]: " + operation + " " + spy.functionName + " " + argsString;
}

function Insect(object, funcName) {
    var oldFunc = object[funcName];
    return (object[funcName] = createInsectSpy(object, object[funcName], funcName));
}

function createInsectSpy(object, func, funcName) {
    var spy = function InsectSpy() {
        insectStack.push(this);
        logger(prettyPrinter(this, "enter", arguments));
        var result = func.apply(object, arguments);
        logger(prettyPrinter(this, "exit", arguments));
        insectStack.pop();
        return result;
    };

    spy.functionName = funcName;

    spy = spy.bind(spy);
    return spy;
}

Insect.all = function all(object, recursive) {
    for (var property in object) {
        if (typeof object[property] === "function") {
            Insect(object, property);
        }
        if (recursive) {
            Insect.all(object, property);
        }
    }
}

Insect.setLogger = function setLogger(logFunction) {
    logger = logFunction;
}

Insect.setPrettyPrinter = function setPrettyPrinter(printer) {
    prettyPrinter = printer;
}

module.exports = Insect;