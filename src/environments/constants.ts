import { environment } from './environment';
export class Constants {

  //Constants used to display pages
  public static HOME_PAGE = {id: 'home', name: 'HomePage', title: 'Início', icon: 'custom-home'};
  public static AUTH_EXT_PAGE = {id: 'auth-ext', name: 'AuthExtPage', title: 'Autenticação', icon: 'home'};
  public static AREAS_EXAMES_PAGE = {id: 'areas-exames', name: 'AreasExamesPage', title: 'Áreas', icon: 'custom-exames'};
  public static LOGIN_PAGE = {id: 'login', name: 'LoginPage', title: 'Login'};
  public static PROFILE_PAGE = {id: 'profile', name: 'ProfilePage', title: 'Perfil', icon: 'custom-perfil'};
  public static PROFILE_EDIT_PAGE = {id: 'edit', name: 'ProfileEditPage', title: 'Editar Perfil'};
  public static RECOVERY_PASSWORD_PAGE = {id: 'recovery-page', name: 'RecoveryPasswordPage', title: 'Recuperar Senha'};
  public static SIGNUP_PAGE = {id: 'signup', name: 'SignupPage', title: 'Cadastro'};
  public static USER_INFORMATION = {id: 'userInformation', name: 'UserInformationPage', title: 'Usuário'};
  public static FILTER_PAGE = {id: 'filter', name: 'FilterPage', title: 'Filtrar', icon: 'ios-funnel'};
  public static USERS_PAGE = {id: 'users', name: 'UsersPage', title: 'Usuários', icon: 'custom-users'};
  public static GROUPS_PAGE = {id: 'groups', name: 'GroupsPage', title: 'Grupos', icon: 'custom-groups'};
  public static IMPORT_DATA_PAGE = {id: 'import-csv', name: 'ImportCsvPage', title: 'Importação de Dados', icon: 'custom-import'};

  public static PATH_DOCUMENTS_USER = '/users/';
  public static PATH_DOCUMENTS_GROUP = '/grupos/';
  public static PATH_DOCUMENTS_LEVANTAMENTO = '/levantamento/';
  public static PATH_DOCUMENTS_LEVANTAMENTO_SRE = '/levantamento_sre/';
  public static PATH_DOCUMENTS_COORDENADA = '/coordenadas/';
  public static PATH_DOCUMENTS_CONFIGURACOES = '/configuracoes/';
  public static PATH_DOCUMENTS_RODOVIA = '/rodovia/';
  /* public static PATH_DOCUMENTS_FOTOSSENSORES = '/fotossensores/'; */
  public static PATH_DOCUMENTS_RODOVIA_SRE = Constants.PATH_DOCUMENTS_RODOVIA + 'sre/';
  public static PATH_DOCUMENTS_RODOVIA_ACIDENTES = Constants.PATH_DOCUMENTS_RODOVIA + 'acidentes/';
  public static PATH_DOCUMENTS_RODOVIA_DEFENSAS = Constants.PATH_DOCUMENTS_RODOVIA + 'defensas/';
  public static PATH_DOCUMENTS_RODOVIA_FOTOS = Constants.PATH_DOCUMENTS_RODOVIA + 'fotos/';
  public static PATH_DOCUMENTS_RODOVIA_PORTICOS = Constants.PATH_DOCUMENTS_RODOVIA + 'porticos/';
  public static PATH_DOCUMENTS_RODOVIA_SEMIPORTICO = Constants.PATH_DOCUMENTS_RODOVIA + 'semiportico/';
  public static PATH_DOCUMENTS_RODOVIA_PONTES = Constants.PATH_DOCUMENTS_RODOVIA + 'pontes/';
  public static PATH_DOCUMENTS_RODOVIA_FOTOSSENSORES = Constants.PATH_DOCUMENTS_RODOVIA + 'fotossensores/';
  public static PATH_DOCUMENTS_RODOVIA_FAIXADEDOMINIO = Constants.PATH_DOCUMENTS_RODOVIA + 'faixaDeDominio/';
  public static PATH_DOCUMENTS_RODOVIA_EXAMES = Constants.PATH_DOCUMENTS_RODOVIA + 'exames/';
  public static PATH_DOCUMENTS_RODOVIA_SINHORIZONTAL = Constants.PATH_DOCUMENTS_RODOVIA + 'sinalizacaohorizontal/';
  public static PATH_DOCUMENTS_RODOVIA_LIMMUNICIPIO = Constants.PATH_DOCUMENTS_RODOVIA + 'limiteMunicipio/';

  public static PATH_DOCUMENTS_ACIDENTES = '/acidentes/';
  public static PATH_DOCUMENTS_DEFENSAS = '/defensas/';
  public static PATH_DOCUMENTS_FAIXADEDOMINIO = '/faixaDeDominio/';
  public static PATH_DOCUMENTS_FISCALIZACAOELETRONICA = '/fiscalizacaoEletronica/';
  public static PATH_DOCUMENTS_LIMITEMUNICIPIO = '/limiteMunicipio/';
  public static PATH_DOCUMENTS_PONTES = '/pontes/';
  public static PATH_DOCUMENTS_PORTICOS = '/porticos/';
  public static PATH_DOCUMENTS_SEMIPORTICOS = '/semiPorticos/';
  public static PATH_DOCUMENTS_SINALIZACAOHORIZONTAL = '/sinalizacaoHorizontal/';
  public static PATH_DOCUMENTS_SRE = '/sre/';
  public static PATH_DOCUMENTS_ESTRADAS = '/estradas/';
  public static PATH_DOCUMENTS_IMOVEIS = '/imoveisAtualizados/';
  public static PATH_DOCUMENTS_LINHAS = '/linhas/';
  public static PATH_DOCUMENTS_ESTACOES = '/estacoes/';
  public static PATH_DOCUMENTS_BUFFER_ESTACOES = '/bufferEstacoes/';
  public static PATH_DOCUMENTS_BUFFER_LINHAS = '/bufferLinhas/';
  public static PATH_DOCUMENTS_AREA_CAMINHAVEL = '/areaCaminhavel/';
  public static PATH_DOCUMENTS_LINHAS_PLANEJADAS ='/linhasPlanejadas/';

  public static BASE_URL_FIREBASE_FUNCTIONS = environment.production ? 'https://us-central1-pav-detect.cloudfunctions.net': 'https://us-central1-pav-detect.cloudfunctions.net';

  // public static CLASSIFICATION_GREAT = {name: 'EXCELENTE', color: '#2E5C1F'};
  // public static CLASSIFICATION_GOOD = {name: 'BOM', color: '#66CC80'};
  // public static CLASSIFICATION_REGULAR = {name: 'REGULAR', color: '#A4A437'};
  // public static CLASSIFICATION_BAD = {name: 'RUIM', color: '#B33235'};

}
