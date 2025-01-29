export const Footer = () => {
    return (
      <footer className="bg-[#0D2C40] text-white py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 px-8 md:px-0">
          {/* Teleconnect Section */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Teleconnect</h3>
            <p className="text-xl leading-relaxed">
              A Teleconnect é uma empresa de telecomunicações que visa conectar
              pessoas e empresas com tecnologia de ponta, qualidade e planos
              flexíveis para todas as necessidades.
            </p>
          </div>
  
          {/* Contato Section */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Entre em Contato</h3>
            <p className="text-xl">+11 98888-77-86</p>
            <p className="text-xl">teleconnect@gmail.com</p>
          </div>
  
          {/* Sedes Section */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Sedes</h3>
            <p className="text-xl">Escritório e fábrica em Ribeirão Preto</p>
          </div>
  
          {/* Serviços Section */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Nossos Serviços</h3>
            <ul className="text-xl space-y-6">
              <li>Banda Larga</li>
              <li>Telefonia Fixa</li>
              <li>Telefonia Móvel</li>
              <li>5G</li>
            </ul>
          </div>
  
          {/* Privacidade Section */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Privacidade</h3>
            <ul className="text-xl space-y-6">
              <li>
                <a href="#" className="hover:underline">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Centro de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        {/* Footer Bottom */}
        <div className="text-center text-xl text-gray-400 mt-20">
          © 2021 - Copyright | All Rights Reserved
        </div>
      </footer>
    );
  };
  