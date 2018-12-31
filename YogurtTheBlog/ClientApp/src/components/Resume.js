import '../stylesheets/Resume.css';
import * as React from "react";

export default class Resume extends React.Component {
    render() {
        return (
            <div className="resume centered-content standard-width box">
                <h2>Привет, я программист на C# и Python и я ищу работу.</h2>
                <p>Возможно, вам нравится <a href="https://t.me/rog_bot">бот</a>, которого я сделал, и в вашей компании
                    нужен программист. Возможно, вашему знакомому в компании нужен программист. Возможно, ни вам, ни
                    вашим знакомым не нужен программист (это круто, ведь программистам нужно платить, а это дорого). Но
                    если все же нужен, то, как вы поняли, я программирую на C# и Python. Я готов учить что-то новое,
                    если это требуется.</p>
                <p>Я не ищу что-то конкретное, это может быть как разработка игр на Unity, так и Backend на Django,
                    главное, чтобы и мне, и работодателю было комфортно.</p>
                <br/>
                <p>На исходный код моих разработок и этого сайта (ASP.NET MVC + React + Redux) можно посмотреть на
                    гитхабе:{' '}
                    <a href="https://gihub.com/yegorf1">github.com/yegorf1</a>
                </p>
                <p>Если вы можете мне что-то предложить, напишите мне прямо в телеграме:{' '}
                    <a href="https://t.me/YogurtTheJob">t.me/YogurtTheJob</a></p>
                <p>Если электронная почта более удобна для вас, напишите мне на почту:{' '}
                    <a href="mailto:job@yogurtthehor.se">job@yogurtthehor.se</a></p>
                <p>Еще я есть в Вконтакте:{' '}
                    <a href="https://vk.com/yogurtthehorse">vk.com/yogurtthehorse</a></p>
                <div className="signature">Егор.</div>
            </div>
        );
    }
}
