import './App.css';
import { useState } from 'react';
import $ from 'jquery';

function App() {
    const[historico, setHistorico] = useState([]);
    const[historicoCopy, setHistoricoCopy] = useState([]);
    const[isOrderedMonth, setIsOrderedMonth] = useState(false);
    const[isOrderedYear, setIsOrderedYear] = useState(false);
    const[isOrderedIpca, setIsOrderedIpca] = useState(false);

    const[valorCorrigido, setValorCorrigido] = useState("0,00");
    const[percentual, setPercentual] = useState("0,00");

    const[dataInicio, setDataInicio] = useState("");
    const[dataFim, setDataFim] = useState("");
    const[valor, setValor] = useState();

    const buscarHistorico = async () => {
        try {
            const connection = await fetch("http://api-ipca.exaltaicifra.com.br/historico", {
                credentials: "include"
            });

            if(connection.ok){
                const response = await connection.json();
                setHistorico(response);
                setHistoricoCopy(response);

            } else{
                console.log(connection.status);
            }
        } catch{
            console.log("Erro na conexão.");
        }
    }

    const calcularCorrecao = async () => {
        try {
            let mesAnoInicial = $("#mes-inicial").val();
            let mesAnoFinal = $("#mes-final").val();
            let valor = $("#valor").val();

            const connection = await fetch(`http://api-ipca.exaltaicifra.com.br?dtInicial=${mesAnoInicial}&dtFinal=${mesAnoFinal}&valor=${valor}`, {
                credentials: "include"
            });

            if(connection.ok){
                let response = await connection.json();
                setValorCorrigido(new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                }).format(response.valorCorrigido));

                setPercentual(response.percentualIntervalo);                     
            }

        } catch{
            console.log("Erro ao calcular a correção.");
        }
    }

    const mesDoAno = (mes) => {
        let mesPorExtenso = "";

        switch(mes){
            case 1:
                mesPorExtenso = "Janeiro";
                break;
            
            case 2:
                mesPorExtenso = "Fevereiro";
                break;

            case 3:
                mesPorExtenso = "Março";
                break;

            case 4:
                mesPorExtenso = "Abril";
                break;

            case 5:
                mesPorExtenso = "Maio";
                break;

            case 6:
                mesPorExtenso = "Junho";
                break;

            case 7:
                mesPorExtenso = "Julho";
                break;

            case 8:
                mesPorExtenso = "Agosto";
                break;

            case 9:
                mesPorExtenso = "Setembro";
                break;

            case 10:
                mesPorExtenso = "Outubro";
                break;

            case 11:
                mesPorExtenso = "Novembro";
                break;

            case 12:
                mesPorExtenso = "Dezembro";
                break;

            default:
                return "error";
        }

        return mesPorExtenso;
    }

    const orderByMonth = () => {
        try {
            if(historicoCopy && historico.length > 0 && !isOrderedMonth){
                const ordered = [...historicoCopy].sort((a, b) => {
                    if(a.mes < b.mes) return -1;
                    if(a.mes > b.mes) return 1;
                
                    return 0;
                });

                setHistorico(ordered);
                setIsOrderedMonth(true);
            }

            if(historicoCopy && historico.length > 0 && isOrderedMonth){
                const ordered = [...historicoCopy].sort((a, b) => {
                    if(a.mes < b.mes) return -1;
                    if(a.mes > b.mes) return 1;
                
                    return 0;
                }).reverse();

                setHistorico(ordered);
                setIsOrderedMonth(false);
            }

        } catch{
            console.log("Erro ao ordenar por mês.");
        }
    }

    const orderByYear = () => {
        try {
            if(historicoCopy && historico.length > 0 && !isOrderedYear){
                const ordered = [...historico].sort((a, b) => {
                    if(a.ano < b.ano) return -1;
                    if(a.ano > b.ano) return 1;

                    return 0;
                });

                setHistorico(ordered);
                setIsOrderedYear(true);
            }

            if(historicoCopy && historico.length > 0 && isOrderedYear){
                const ordered = [...historico].sort((a, b) => {
                    if(a.ano < b.ano) return -1;
                    if(a.ano > b.ano) return 1;

                    return 0;
                }).reverse();

                setHistorico(ordered);
                setIsOrderedYear(false);
            }
        } catch{
            console.log("Erro ao ordenar por ano.");
        }
    }

    const orderByIpca = () => {
        try {
            if(historicoCopy && historico.length > 0 && !isOrderedIpca){
                const ordered = [...historico].sort((a, b) => {
                    if(a.ipca < b.ipca) return -1;
                    if(a.ipca > b.ipca) return 1;

                    return 0;
                });

                setHistorico(ordered);
                setIsOrderedIpca(true);
            }

            if(historicoCopy && historico.length > 0 && isOrderedIpca){
                const ordered = [...historico].sort((a, b) => {
                    if(a.ipca < b.ipca) return -1;
                    if(a.ipca > b.ipca) return 1;

                    return 0;
                }).reverse();

                setHistorico(ordered);
                setIsOrderedIpca(false);
            }
        } catch {
            console.log("Erro ao ordenar por IPCA.");
        }
    }

    const formatDataInicio = (data) => {
        let removeNaN = data.replace(/\D/g, "");

        if(removeNaN.length > 1){
            removeNaN = removeNaN.slice(0, 2) + "/" + removeNaN.slice(2);
        }
     
        setDataInicio(removeNaN);    
    }

    const formatDataFim = (data) => {
        let removeNaN = data.replace(/\D/g, "");

        if(removeNaN.length > 1){
            removeNaN = removeNaN.slice(0, 2) + "/" + removeNaN.slice(2);
        }
     
        setDataFim(removeNaN);    
    }

    const formatMoney = (money) => {
        let removeNaN = money.replace(/\D/g, "");

        let floatValue = parseFloat(removeNaN) / 100;

        let formatedValue = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(floatValue);

        setValor(formatedValue);
    }

    return (
        <div className="App">
            <div className="container-main">
                <h1>Históricos e Cálculo do IPCA</h1>
                <form 
                    id="form-values" 
                    onSubmit={(e) => e.preventDefault()}>
                    <div className="container-inp-mes-inicial">
                        <label for="mes-inicial">Mês Inicial</label>
                        <input 
                            id="mes-inicial" 
                            name="dtInicial"
                            type="text" 
                            maxLength={7}
                            value={dataInicio}
                            onChange={(e) => formatDataInicio(e.target.value)}
                            placeholder="MM/AAAA"
                        />
                    </div>
                    <div className="container-inp-mes-final">
                        <label for="mes-final">Mês Final</label>
                        <input 
                            id="mes-final" 
                            name="dtFinal"
                            type="text" 
                            maxLength={7}
                            value={dataFim} 
                            onChange={(e) => formatDataFim(e.target.value)}
                            placeholder="MM/AAAA"
                        />
                    </div>
                    <div className="container-valor">
                        <label for="valor">Valor na data inicial</label>
                        <input 
                            id="valor" 
                            name="valor"
                            type="text"
                            value={valor}
                            onChange={(e) => formatMoney(e.target.value)}
                            placeholder="R$ 999,99"
                        />
                    </div>
                    <button 
                        id="btn-submit"
                        onClick={() => calcularCorrecao()}>
                        <img src="/assets/seta-direita.png" alt=""/>
                    </button>
                </form>
                <div className='container-dados'>
                    <button
                        id="btn-history"
                        onClick={() => buscarHistorico()}>
                        Mostrar Histórico
                    </button>
                    <div className='view-value'>
                        <label>Valor corrigido:</label>
                        <input 
                            id="valor"
                            type='text'
                            value={valorCorrigido}
                            placeholder='R$ 0,00'
                            disabled
                        />
                        <input
                            id="inp-percentual"
                            type="text"
                            value={percentual + " %"}
                            disabled
                        />
                    </div>
                </div>           
            </div>
            <div className="container-table">
                <table id="table-historical">
                    <caption>Histórico de Inflação</caption>
                    <thead>
                        <tr>
                            <th 
                                id="mes" 
                                title="Ordenar por mês"
                                onClick={() => orderByMonth()}>
                                Mês
                            </th>
                            <th 
                                id="ano" 
                                title="Ordenar por ano"
                                onClick={() => orderByYear()}>
                                Ano
                            </th>
                            <th 
                                id="ipca" 
                                title="Ordenar por IPCA"
                                onClick={() => orderByIpca()}>
                                IPCA
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(historico && historico.length > 0) ? 
                            historico.map((elements, index) => (
                                <tr key={index}>
                                    <td className='tdmes'>{mesDoAno(elements.mes)}</td>
                                    <td className='tdano'>{elements.ano}</td>
                                    <td className='tdipca'>{elements.ipca} %</td>
                                </tr> 
                            )):
                            <p className='message'>Clique no botão "Mostrar Histórico"</p>    
                        }                     
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
