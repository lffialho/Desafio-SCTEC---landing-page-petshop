document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarRolagem();
  configurarFormulario();
  animarMetricas();
  revelarAoRolar();
  configurarModal();
});

function configurarMenu() {
  const botao = document.querySelector(".menu-botao");
  const menu = document.querySelector(".menu");
  const links = document.querySelectorAll(".menu a");

  if (!botao || !menu) return;

  const fecharMenu = () => {
    menu.classList.remove("aberto");
    botao.setAttribute("aria-expanded", "false");
  };

  botao.addEventListener("click", () => {
    const estaAberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(estaAberto));
  });

  links.forEach(link => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("click", event => {
    if (!botao.contains(event.target) && !menu.contains(event.target)) {
      fecharMenu();
    }
  });
}

function configurarRolagem() {
  const links = document.querySelectorAll("a[href^='#']");
  const botoes = document.querySelectorAll("[data-scroll]");

  links.forEach(link => {
    link.addEventListener("click", event => {
      const destino = document.querySelector(link.getAttribute("href"));

      if (!destino) return;

      event.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    });
  });

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      const destino = document.querySelector(botao.dataset.scroll);

      if (destino) {
        destino.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function configurarFormulario() {
  const formulario = document.getElementById("formularioContato");

  if (!formulario) return;

  formulario.addEventListener("submit", event => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome) {
      alert("Por favor, preencha seu nome.");
      return;
    }

    if (!email.includes("@") || !email.split("@")[1]?.includes(".")) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    if (!mensagem) {
      alert("Por favor, escreva uma mensagem.");
      return;
    }

    alert("Mensagem enviada com sucesso! 🐾 Em breve retornaremos.");
    formulario.reset();
  });
}

function animarMetricas() {
  const valores = document.querySelectorAll(".valor");

  if (!valores.length) return;

  const observador = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const valor = entry.target;
      const textoOriginal = valor.innerText;
      const alvo = parseInt(textoOriginal.replace(/\D/g, ""), 10);
      let contador = 0;

      const intervalo = setInterval(() => {
        contador += Math.ceil(alvo / 40);
        valor.innerText = contador;

        if (contador >= alvo) {
          valor.innerText = textoOriginal;
          clearInterval(intervalo);
        }
      }, 40);

      observador.unobserve(valor);
    });
  }, { threshold: 0.5 });

  valores.forEach(valor => observador.observe(valor));
}

function revelarAoRolar() {
  const elementos = document.querySelectorAll(".revelar");

  if (!elementos.length) return;

  const observador = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visivel");
      observador.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  elementos.forEach(elemento => observador.observe(elemento));
}

function configurarModal() {
  const abrir = document.querySelector("[data-modal-abrir]");
  const modal = document.querySelector(".modal");
  const fechar = document.querySelector(".modal-fechar");
  const formulario = document.getElementById("formularioAgendamento");
  const servico = document.getElementById("servico");
  const porte = document.getElementById("porte");
  const hospedagem = document.getElementById("hospedagemOpcoes");
  const quartos = document.querySelectorAll("input[name='hospedagem']");
  const precoEstimado = document.getElementById("precoEstimado");
  const precoIndividual = document.getElementById("precoIndividual");
  const precoCompartilhado = document.getElementById("precoCompartilhado");

  if (!abrir || !modal || !fechar) return;

  const precos = {
    banho: {
      nome: "Banho & Tosa",
      pequeno: "R$ 55",
      medio: "R$ 75",
      grande: "R$ 95"
    },
    consulta: {
      nome: "Consulta",
      pequeno: "R$ 120",
      medio: "R$ 120",
      grande: "R$ 140"
    },
    loja: {
      nome: "Loja",
      pequeno: "a partir de R$ 45",
      medio: "a partir de R$ 70",
      grande: "a partir de R$ 95"
    },
    hotel: {
      nome: "Hotel",
      individual: {
        pequeno: "R$ 95 por diária",
        medio: "R$ 120 por diária",
        grande: "R$ 150 por diária"
      },
      compartilhado: {
        pequeno: "R$ 70 por diária",
        medio: "R$ 90 por diária",
        grande: "R$ 115 por diária"
      }
    }
  };

  const atualizarHospedagem = () => {
    const ehHotel = servico?.value === "hotel";

    if (!hospedagem) return;

    hospedagem.hidden = !ehHotel;

    quartos.forEach(quarto => {
      quarto.required = ehHotel;

      if (!ehHotel) {
        quarto.checked = false;
      }
    });
  };

  const atualizarPrecosHospedagem = () => {
    if (!precoIndividual || !precoCompartilhado || !porte?.value) {
      if (precoIndividual) precoIndividual.textContent = "Selecione o porte";
      if (precoCompartilhado) precoCompartilhado.textContent = "Selecione o porte";
      return;
    }

    precoIndividual.textContent = precos.hotel.individual[porte.value];
    precoCompartilhado.textContent = precos.hotel.compartilhado[porte.value];
  };

  const atualizarEstimativa = () => {
    if (!precoEstimado || !servico || !porte) return;

    atualizarPrecosHospedagem();

    const servicoSelecionado = servico.value;
    const porteSelecionado = porte.value;

    if (!servicoSelecionado || !porteSelecionado) {
      precoEstimado.textContent = "Selecione serviço e porte para ver uma estimativa.";
      return;
    }

    if (servicoSelecionado === "hotel") {
      const quartoSelecionado = document.querySelector("input[name='hospedagem']:checked")?.value;

      if (!quartoSelecionado) {
        precoEstimado.textContent = "Escolha quarto individual ou compartilhado para ver a estimativa do hotel.";
        return;
      }

      const tipoQuarto = quartoSelecionado === "individual" ? "quarto individual" : "quarto compartilhado";
      precoEstimado.textContent = `${precos.hotel.nome} em ${tipoQuarto}: ${precos.hotel[quartoSelecionado][porteSelecionado]}.`;
      return;
    }

    const item = precos[servicoSelecionado];
    precoEstimado.textContent = `${item.nome}: ${item[porteSelecionado]} para pet de ${porteSelecionado} porte.`;
  };

  const atualizarAgendamento = () => {
    atualizarHospedagem();
    atualizarPrecosHospedagem();
    atualizarEstimativa();
  };

  const abrirModal = () => {
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    fechar.focus();
  };

  const fecharModal = () => {
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    abrir.focus();
  };

  abrir.addEventListener("click", abrirModal);
  fechar.addEventListener("click", fecharModal);

  servico?.addEventListener("change", atualizarAgendamento);
  porte?.addEventListener("change", atualizarEstimativa);
  quartos.forEach(quarto => {
    quarto.addEventListener("change", atualizarEstimativa);
  });

  formulario?.addEventListener("submit", event => {
    event.preventDefault();

    if (!formulario.reportValidity()) return;

    alert("Agendamento recebido! Entraremos em contato pelo WhatsApp para confirmar as informações e os valores.");
    formulario.reset();
    atualizarAgendamento();
    fecharModal();
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      fecharModal();
    }
  });

  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("aberto")) {
      fecharModal();
    }
  });
}
