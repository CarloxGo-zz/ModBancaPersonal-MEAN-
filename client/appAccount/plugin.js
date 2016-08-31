var plugin = (function(w){
    //COMPROBAR FUNCIONES DEL DEBUGGER
    var method,
        noop = function () {},
        methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (w.console = w.console || {});

    while (length--) {
        method = methods[length];

        if (!console[method])
            console[method] = noop;
    }
    //ELIMINAR UN ELEMENTO DE UN ARRAY
    Array.prototype.arrUnset = function (item){
        var position = this.indexOf(item);
        if( ~position ) this.splice(position, 1);
    };
    //ELIMINAR  UN NODO - [nodeElement].remove()
    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for(var i = 0, len = this.length; i < len; i++) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };
    //CONTAR NUMERO DE LETRAS
    String.prototype.countAll = function(letter){
        var letterCount = 0;
        for (var i = 0, len = this.length; i < len; i++) {
            if( this.charAt(i).toUpperCase() === letter.toUpperCase() )
                letterCount++;
        }
        return letterCount;
    };

    
    return {
        //CREAR UNA COOKIE
        setCookie : function (cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        //OBTENER UNA COOKIE POR SU NOMBRE
        getCookie : function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++)
              {
              var c = ca[i].trim();
              if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
              }
            return "";
        },
        //SELECCIONAMOS EL ANTERIOR NODO HERMANO QUE SEA DE TIPO ELEMENTO
        getPreviousNodeElement : function (n) {
            var x = n.previousSibling;
            while ( x.nodeType !== Node.ELEMENT_NODE ) {
              x = x.previousSibling;
            }
            return x;
        },
        //AÑADIR UN NUEVO ELEMENTO DOM DESPUÉS
        insertAfter : function (referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        //COMPROBAR SI ES NULA UNA VARIABLE
        isEmpty : function (str) {
           return (!str || 0 === str.length);
        },
        //COMPROBAR EL CONSTRUCTOR DE UNA VARIABLE
        checkTypeof : function (variable, type){
            if(!type || 0 === type.length){
                return w.console.log(Object.prototype.toString.call(variable).split(" ")[1].slice(0, -1));
            }
            var constructor = type.trim().charAt(0).toUpperCase() + type.trim().slice(1),
                checkType = Object.prototype.toString.call(variable) === "[object "+constructor+"]";
            if( constructor !== "Number" ){
                return checkType;
            }else{
                return checkType &&  !isNaN(variable);
            }
        },
        // RETURNS THE LAST DAY OF A GIVEN MONTH
        getLastDayInMonth : function (aDate){
            var m = w.parseInt(aDate.getMonth(), 10),
                y = w.parseInt(aDate.getYear(), 10),
                tmpDate = new Date(y, m, 28),
                checkMonth = tmpDate.getMonth(),
                lastDay = 27;

            while(lastDay <= 31){
                tmpDate.setDate(lastDay + 1);
                if( checkMonth != tmpDate.getMonth() ) break;
                lastDay++;
            }
            return lastDay;
        },
        //RETURNS THE FIRST DAY OF WEEK (MONDAY)
        getFirstDayWeek : function (thisDate) {
          var   d = new Date(thisDate),
                day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          return new Date(d.setDate(diff));
        },
        //RETURNS THE LAST DAY OF WEEK (SUNDAY) 
        getLastDayWeek : function (thisDate){
            var d = new Date(thisDate),
                first = this.getFirstDayWeek(d).getDate(),
                last = first + 6; // last day is the first day + 6
            return new Date( d.setDate(last) );
        }
    };
}(window));