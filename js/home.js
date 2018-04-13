// Scroll navbar
function checkScroll(){
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if($(window).scrollTop() > startY){
        $('.navbar').addClass("scrolled");
    }else{
        $('.navbar').removeClass("scrolled");
    }
}

if($('.navbar').length > 0){
    $(window).on("scroll load resize", function(){
        checkScroll();
    });
}


 
//carousel
$(window).resize(function(){
   console.log('resize called');
   var width = $(window).width();
   if(width >= 768){
       $('.carousel-add').addClass('carousel-inner');
   }
   else{
       $('.carousel-add').removeClass('carousel-inner');
   }
})
.resize();

$(document).ready(function(){
     $("#myCarousel").carousel({
         interval : false
     });
});
