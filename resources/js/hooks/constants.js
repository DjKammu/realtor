export const useDefaultPhoto = (abc) => {
  return `https://ui-avatars.com/api/?name='.urlencode(${abc}).'&color=7F9CF5&background=EBF4FF`;
}

export  const sortOrderBy = (orderBy,order, param = 'orderby') => function() {
		var fullUrl = window.location.href.split("#")[0];
		let isOrderBy = fullUrl.includes(param) ;
		let isSort = fullUrl.includes('order') ;
		var url = '/';
		if(isOrderBy || isSort){ 
		fullUrl = replaceUrlParam(fullUrl,param,orderBy);
		fullUrl = replaceUrlParam(fullUrl,'order',order);
		url = fullUrl;
		}
		else{
		url = fullUrl+(fullUrl.includes('?')?'&':'?')+param+'='+orderBy+'&order='+order
		}
		window.location.href = url;
}
      
const  replaceUrlParam = (url, paramName, paramValue) =>
{
  if (paramValue == null) {
      paramValue = '';
  }
  var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
  if (url.search(pattern)>=0) {
      return url.replace(pattern,'$1' + paramValue + '$2');
  }
  url = url.replace(/[?#]$/,'');
  return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
}
