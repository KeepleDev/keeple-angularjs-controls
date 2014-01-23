module gopp {
    class Person {
        nome: string = '';
        sobrenome: string = '';
        idade: number = 0;
    };

    class GreetingManager {
        personToGreet: Person = new Person();

        setPersonToGreet(person: Person) {
            this.personToGreet = person;
        }

        greet() {
            return 'Hello, ' + this.personToGreet.nome;
        }
    }

    var manager = new GreetingManager();
    var person = new Person();
    person.nome = 'Guilherme';
    manager.setPersonToGreet(person);
    manager.greet();
}