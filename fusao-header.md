<script>
    function getCookie_a(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
     function setCookie_c(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.odontomaster.com.br;path=/";
    	
    }

    if ((getCookie_a("_EMAIL_")!="") && (getCookie_a("_CADASTRO_")!="")) {
        
        setCookie_c("_CADASTRO_", "", "1000");
        window.location = "https://checkout.odontomaster.com.br/Fechamento";
        
    }
</script>

<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="640">
<meta name="viewport" content="initial-scale = 1, maximum-scale = 1, user-scalable = no">
<style>
@@media (min-width: 576px) {
    .container {
        max-width: 100vw!important;
    }
}
section.fbits-section-home.fbits-banner-centro-home img {
    margin: 0 auto!important;
}
    div#loading {
        background: #fff;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99999;
    }
    #loading {
        background: #fff!important;
        background-position: center!important;
        background-repeat: no-repeat!important;
    }
    span.minicart-txt-itens {
        display: none;
    }
    .header-container.type2 .main-nav .menu-wrapper, .header-container.type3 .main-nav, .header-container.type3.header-newskin .main-nav, .header-container.type19 .main-nav, .header-container.type20 .main-nav, .header-container.type4.header-newskin .main-nav .menu-wrapper, .header-container.type4 .main-nav .menu-wrapper, .header-container.type9 .main-nav .menu-wrapper, .header-container.type10 .header-wrapper, .header-container.type10.header-newskin .header-wrapper, .header-container.type3.sticky-header .header-wrapper, .header-container.type3.header-newskin.sticky-header .header-wrapper, .header-container.type20.sticky-header .header-wrapper, .header-container.type4.header-newskin.sticky-header .header-wrapper, .header-container.type4.sticky-header .header-wrapper, .header-container.type10.sticky-header .header-wrapper, .header-container.type20 .header-wrapper {
        background-color: #1c5787;
    }
    .header-container.type4 .main-nav {
        background: #1c5787!important;
    }
    
    @@media (min-width: 1280px) {
        .main-nav h1.logo img {
            max-width: 249px!important;
        }
        .main-nav h1 {
            top: -85px!important;
            max-width: 250px!important;
        }
        .main-nav .container {
            padding-left: 0!important;
        }
        li.item.raiz.ultimo.item0.menu-geral.estudante {
            float: none;
        }
    }
   
    @@media (max-width:990px){
        .header-container.type4.header-newskin .menu-icon {
            left: 7.1em!important;
        }
    }
    body li.item.raiz.item0.estudante {
        background: url(https://recursos.odontomaster.com.br/i/odonto/area-estudante.svg) #3434E3!important;
    }
</style>

<div id="loading">
    
</div>
<a name="topo"></a>

<div class="wrapper">
    <div class="page">

<div class="header-container type4 header-newskin">
    <div class="top-links-container">
        <div class="top-links container">
                        
     <span class="textleft"><b>ATENÇÃO!</b> Os produtos desse site são restritos à Dentistas com CRO, Clínicas Odontológicas e Estudantes de Graduação em Odontologia.<a></a></span>    
             <span class="textright">@FBITSLogin.Add()</span>  
            
        </div>
    </div>
    <div class="header container">
                <h1 class="logo"><a href="/" class="logo"><img src="https://recursos.odontomaster.com.br/i/logo_odonto.png"></a></h1>
                <div class="cart-area">
            <div class="custom-block">
                <span style="color:#787d7f;display:block;">TELEVENDAS
                    <b style="color:#606669;font-size:16px;font-weight:600;display:block;line-height:20px;">(71) 3173-7300</b>
                </span></div>            
                
                <div class="icoatendimento">
                    <div class="dropatend">
                         <b>Pelos Telefones:</b>
				         <p>(71) 3173-7300 - Salvador/BA</p>
				         <p>(75) 3322-8498 - Feira de Santana/BA</p>
				         <p>(79) 3085-0710 - Aracaju/SE</p>
				         
				         <b>Pelo WhatsApp:</b>
				         <p>(71) 98867-0812</p>
				         <p>(71) 99401-9924</p>
				         
				         <b>Horário de Atendimento:</b>
				         <p>Segunda a Sexta das 08:00 às 18:00</p>
				         <p>Sábados 08:00 às 14:00</p>
				         
				         
				    </div>
                </div>
                
                <style>
                    .dropatend {
                        display:none;
                    }
                </style>
                
                <div class="icoconta">
                    
                </div>
                
                <div class="mini-cart">
                    
                    <a href="javascript:void(0)" class="mybag-link"><i class="icon-mini-cart"></i><span>Item(s)</span></a>
        <div class="topCartContent block-content theme-border-color">
            <div class="inner-wrapper">                                                                    
                        
                        
                        @FBITSCarrinho.Add()
                        
                            </div>
        </div>
</div>
        </div>
        <div class="search-area">
            <a href="javascript:void(0);" class="search-icon"><i class="icon-search"></i></a>
             <form id="searchFormHeader" autocomplete="off" method="get" action="/busca" itemprop="potentialAction" itemscope="" itemtype="http://schema.org/SearchAction">
                  <div class="form-search ">
        
                @*<input id="search" type="text" name="q" class="input-text" autocomplete="off">*@
                
                <div class="headerSearch " itemscope="" itemtype="http://schema.org/WebSite">
                <meta itemprop="url" content="https://www.odontomaster.com.br/">
                  <meta itemprop="target" content="https://www.odontomaster.com.br/Busca?busca={busca}">
            
            
                    <span class="hide">
                        <button class="btSearch greenBack hide" type="button" id="btnBusca">
                          buscar <i class="icon isearch"></i>
                        </button>
                       @* @FBITSSearch.Add() *@
                    </span>
                    <input type="text" value="" class="inputSearch ac_input search" id="txtBuscaPrincipal" itemprop="query-input" name="busca" data-placeholder="Busque aqui.." autocomplete="off" placeholder="Busque aqui..">
            
            
                
              </div>
                
               @* <select id="cat" name="cat">
            
            
                </select>*@
                
                <script>
                    $("#cat").html($("#escolhaFrabricante").html());
                    
                    function updateCartVisibility() {
                        var cartItemCountElement = $(".minicart-qtde-itens");
                         if (cartItemCountElement.length > 0) {
                            var itemCount = cartItemCountElement.html();

                                        if (itemCount !== "0" && itemCount !== "") {
                            $(".cart-empty").hide();
                    } else {
                        $(".cart-empty").show(); // Adicionado para o caso de o carrinho ser esvaziado
                    }

                    $(".cart-qty").html(itemCount);
        }
    }
                    $(document).ready(function() {
                        updateCartVisibility();
    });
                            
                      
                    
                   $(document).ajaxComplete(function() {
        updateCartVisibility();
                    });
                    
                    
                </script>
                
                <button type="submit" title="Search" class="button"><i class="icon-search"></i></button>
        <div id="search_autocomplete" class="search-autocomplete" style="display: none;"></div>
        <div class="clearer"></div>
    </div>
</form>

        </div>
        <div class="menu-icon"><a href="javascript:void(0)" title="Menu"><i class="fa fa-bars"></i></a></div>
            </div>
    <div class="header-wrapper">
<div class="main-nav">
    <div class="fechamenu"><i class="fa fa-times-circle" aria-hidden="true"></i></div>
    <div class="container">      
         <h1 class="logo"><a href="/" class="logo"><img src="https://recursos.odontomaster.com.br/i/logo_odonto.png" alt=" Commerce"></a></h1>
        <div class="menu-wrapper">
            <div class="menu-all-pages-container">
                <ul class="menu">
                        
                        @{Html.RenderAction("MenuTopo", "Menu");}

                </ul>

            </div>
        </div>
    </div>
</div>

</div>

</div>




@if (Convert.ToBoolean(G.Dados["Search-Barra-Fixa-Ativa"]))
{
    Html.FbitsRenderPartial("HeaderFloating");
}