class complex{
    constructor(_a, _b){
        this.a = _a;
        this.b = _b;
    }
}

function add(n1, n2){ return new complex(n1.a+n2.a, n1.b+n2.b); }
function minus(n1, n2){ return new complex(n1.a-n2.a, n1.b-n2.b); }
function mult(n1, n2){ return new complex(n1.a*n2.a-n1.b*n2.b, n1.a*n2.b+n1.b*n2.a); }
function div(n, r){ return new complex(n.a/r, n.b/r); }
function conjugate(n){ return new complex(n.a, -n.b); }
function modulus(n){ return Math.sqrt(n.a*n.a + n.b*n.b); }
function epow(n){ return new complex(Math.exp(n.a)*Math.cos(n.b), Math.exp(n.a)*Math.sin(n.b)); }
