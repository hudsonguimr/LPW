const express = require("express");
const { response, request } = require("express");
const server = express();

server.use(express.json());
server.use((request, response, next) => {
  console.log("Controle de Estoque ABC");
  return next();
});
const prod = [
  {
    id: 01,
    nome: "Agua",
    quant: 100.0,
    valorunit: 2.0,
    precovalor: 4.0,
    totpreco: 0,
    lucro: 0,
  },
];

function calc(calcprod) {
  for (let i = 0; i < calcprod.length; i++) {
    calcprod[i].totpreco = calcprod[i].quant * calcprod[i].valorunit;
    calcprod[i].precovenda =
      calcprod[i].valorunit + calcprod[i].valorunit * 0.2;
    calcprod[i].lucro = calcprod[i].precovalor - calcprod[i].valorunit;

    if (calcprod[i].quant < 50) {
      calcprod[i].sit = "Estável";
    } else if (calcprod[i].quant >= 50 && calcprod[i].quant < 100) {
      calcprod[i].sit = "Boa";
    } else if (calcprod[i].quant >= 100) {
      calcprod[i].sit = "Excelente";
    }
  }
}

function test(request, response, next) {
  const { id } = request.params;
  const save = prod.filter((obj) => {
    return obj.id == id;
  });

  if (save.length == 0) {
    return response.status(400).json({
      Error: "ID não encontrado",
    });
  }
  return next();
}

server.get("/produto", (request, response) => {
  return response.json(prod);
});
server.get("/produto/:id", test, (request, response) => {
  const { id } = request.params;
  const alf = prod.filter((bet) => {
    return bet.id == id;
  });
  return response.json(alf);
});
function testprod(request, response, next) {
  const { id, nome, quant, valorunit, comp } = request.body;
  if (
    nome === "" ||
    quant === "" ||
    id === "" ||
    valorunit === "" ||
    comp === undefined
  ) {
    return response.status(400).json({
      Error: "Preenchimento incorreto.",
    });
  }
  return next();
}
server.post("/produto", testprod, (request, response) => {
  prod.push(request.body);
  calc(prod);
  return response.json(prod[prod.length - 1]);
});

server.put("/produto", testprod, (request, response) => {
  const id = request.body.id;
  let index = 0;
  let i = prod.filter((prod, index) => {
    if (prod.id === id) {
      x = index;
      return prod.id === id;
    }
  });
  if (i.length === 0) {
    return response.status(400).json({ error: "ID not Found" });
  }
  prod[index] = request.body;
  return response.json(prod);
});

server.delete("/produto/:id", test, (request, response) => {
  const { id } = request.params;
  let index = 0;
  let i = 0;
  while (i < prod.length) {
    if (prod[i].id == id) {
      console.log(prod[i]);
      prod.splice(i, 1);
    }
    i++;
  }

  return response.json(prod);
});

server.post("/produto/:id/comp", test, (request, response) => {
  const c = request.body.comp;
  const id = request.params.id;
  for (let i = 0; i < prod.length; i++) {
    if (prod[i].id === Number(id)) {
      console.log(prod[i].c);
      prod[i].comp = c;
    }
  }
  //  return response.json(prod)
  return response.json(prod);
});

server.listen(3333);
