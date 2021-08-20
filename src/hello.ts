class Person {
    private fullName: string = null;
    constructor(private firstName: string, private lastName: string) {
        this.fullName = firstName + " " + lastName;
    }
    public getName(): string {
        return this.fullName;
    }
}
const person: Person = new Person("Chicken", "mini");
console.log(person.getName());

function abc() {
    console.log("");
}
abc();

//test.js
function init() {
    const single_q = "hello world";
    const double_q = "hello world";
    const no_semi = 500;
    console.log("hello world!");
}
init();