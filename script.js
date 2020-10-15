/* @author Vikram Soni <vikram9880@gmail.com> */

// globals

grid_size = 2
level = 1
random_list = []

//helper functions

generate_html = (grid_size, level) => {
  var html = ""
  for(i=0;i<grid_size**2;i++){
    html = html + "<div class='box' id='"+i+"'>&nbsp;</div>"
  }
  $(".level").html("Level <b>" + level +"</b>")
  $(".game").html(html)
  $(".game").css("grid-template-columns","repeat("+ grid_size +", 1fr)")
}

generate_divs = async (grid_size, level) => {
  await new Promise(resolve=>setTimeout(resolve, 500))
  $(".game").fadeOut(500)
  await new Promise(resolve=>setTimeout(resolve, 500))
  generate_html(grid_size, level)
  $(".game").fadeIn(500)
  await new Promise(resolve=>setTimeout(resolve, 500))
}

get_next = (grid_size, level) => {
  return _.shuffle(_.range(grid_size**2)).slice(0, level)
}

init = () => {
  grid_size = 3
  level = 1
  generate_divs(grid_size, level);
  random_list = get_next(grid_size, level)
}

start = async () => {
  random_list = get_next(grid_size, level)
  await new Promise(resolve=>setTimeout(resolve, 1500))
  for(const item of random_list){
    await new Promise(resolve=>setTimeout(resolve, 500))
    $("#"+item).addClass("flash") 
    await new Promise(resolve=>setTimeout(resolve, 500))
    $("#"+item).removeClass("flash")
  }
  $(".game").removeClass("disable")
}

attempt = async (box)=>{
  if( $(box).attr("id") == random_list[0] ){
    $(box).addClass("correct");
    random_list.shift()
    if(random_list.length==0){
      $(".game").addClass("disable");
      if(grid_size < 7)
        grid_size = grid_size + 1
      level = level + 1
      await new Promise(resolve=>setTimeout(resolve, 800))
      generate_divs(grid_size, level);
      start()
    }
  }
  else if (random_list.length>0){
    $(box).addClass("incorrect")
    $(".game").addClass("disable")
    await new Promise(resolve=>setTimeout(resolve, 800))
    generate_divs(grid_size, level);
    start()
  }
}

//event handlers

$(document).on("click", ".box", function(){
  attempt(this)
 });

$('#start').click(function(){
  $(".help").slideUp(400, 'easeInOutCubic', ()=>{
    $("#reset").show()
    $(".level").css("visibility", "visible") });
  start()
});

$("#reset").click(function(){
  init()
  $(".help").slideDown(400, 'easeInOutCubic');
  $("#reset").hide();
  $(".level").css("visibility", "hidden");
});

init()