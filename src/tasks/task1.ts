process.stdin.setEncoding("utf8");

console.log("Type some text to reverse it");

function reverseString(string: string) {
    return string.split("").reverse().join("");
}

process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write(reverseString(chunk));
        process.stdout.write('\n');
    }
});

