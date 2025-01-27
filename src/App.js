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

    //const icoSuccess = "/assets/sucesso.png";
    const icoError = "/assets/erro.png";
    const[styleMessage, setStyleMessage] = useState("container-message-hidden");
    const[message, setMessage] = useState("");
    const[icoMessage, setIcoMessage] = useState();

    const[isLoading, setIsLoading] = useState(false);

    const buscarHistorico = async () => {
        setIsLoading(true);
        try {
            const connection = await fetch("https://api-ipca2.onrender.com/historico", {
                credentials: "include"
            });

            if(connection.ok){
                const response = await connection.json();
                setIsLoading(false);
                setHistorico(response);
                setHistoricoCopy(response);

            } else{
                console.log(connection.status);
                setIsLoading(false);
            }
        } catch{
            console.log("Erro na conexão.");
            setIsLoading(false);
        }
    }

    const calcularCorrecao = async () => {
        setIsLoading(true);
        try {
            let mesAnoInicial = $("#mes-inicial").val();
            let mesAnoFinal = $("#mes-final").val();
            let valor = $("#valor").val();

            const[mesInicio, anoInicio] = mesAnoInicial.split("/").map(Number);
            const[mesFim, anoFim] = mesAnoFinal.split("/").map(Number);

            const indiceInicio = anoInicio * 12 + mesInicio;
            const indiceFim = anoFim * 12 + mesFim;

            if(indiceFim < indiceInicio){
                setIsLoading(false);
                setIcoMessage(icoError);
                setMessage("A Data Final não pode ser inferior que a Data Início.");
                setStyleMessage("container-message-error");   
                setValorCorrigido("0,00");
                setPercentual("0,00"); 

            } else if(mesAnoInicial !== "" && mesAnoFinal !== "" && valor !== "") {
                setStyleMessage("container-message-hidden"); 

                const connection = await fetch(`https://api-ipca2.onrender.com/calcularCorrecao?dtInicial=${mesAnoInicial}&dtFinal=${mesAnoFinal}&valor=${valor}`, {
                    credentials: "include"
                });
    
                if(connection.ok){
                    let response = await connection.json();
                    setValorCorrigido(new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    }).format(response.valorCorrigido));
    
                    setPercentual(response.percentualIntervalo); 
                    setIsLoading(false);                    
                }
            } else{
                setIsLoading(false);
                setIcoMessage(icoError);
                setMessage("Preencha todos os campos!");
                setStyleMessage("container-message-error");   
                setValorCorrigido("0,00");
                setPercentual("0,00"); 
            }

        } catch{
            console.log("Erro ao calcular a correção.");
            setIsLoading(false);
            setValorCorrigido("0,00");
            setPercentual("0,00"); 
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
        if(money !== ""){
            let removeNaN = money.replace(/\D/g, "");

            let floatValue = parseFloat(removeNaN) / 100;
    
            let formatedValue = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(floatValue);
    
            setValor(formatedValue);
        }       
    }

    return (
        <div className="App">
            <div className='background'></div>
            <div className={styleMessage}>
                <img src={icoMessage} alt=""/>
                <p id="message">{message}</p>
            </div>
            <div className="container-main">
                <h1>Histórico e Cálculo do IPCA</h1>
                <form 
                    id="form-values" 
                    onSubmit={(e) => e.preventDefault()}>
                    <div className="container-inp-mes-inicial">
                        <label for="mes-inicial">Mês Inicial:</label>
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
                        <label for="mes-final">Mês Final:</label>
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
                        <label for="valor">Valor na data inicial:</label>
                        <input 
                            id="valor" 
                            name="valor"
                            type="text"
                            value={valor}
                            onChange={(e) => formatMoney(e.target.value)}
                            placeholder="R$ 999,99"
                        />
                    </div>
                    {(isLoading) ? 
                        <img 
                            id="ico-loading"
                            src="/assets/loading.gif" 
                            alt=""
                            /> :
                        <></>
                    }
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
                        <tr id="trHeader">
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
