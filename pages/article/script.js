const docPDF = new jspdf.jsPDF();

document.getElementById("searchBarInput").addEventListener("keydown", ({ key, target }) => {
  if (key !== "Enter") return;
  let relevantOptions = Array.from(document.getElementById("searchItems").children).map((option) => option.value).filter((option) => option.toLowerCase().startsWith(target.value.toLowerCase()) || target.value.toLowerCase().startsWith(option.toLowerCase()));
  location.href = "/" + ((relevantOptions.length) ? ((target.value = relevantOptions[0]) && relevantOptions[0].toLowerCase()) : target.value.toLowerCase());
});

document.getElementById("downloadButton").addEventListener("click", () => {
  docPDF.html(document.getElementById("rightContentBox"), {
    callback: function(docPDF) {
      docPDF.save(location.pathname.substring(1) + ".pdf");
    },
    x: 15,
    y: 15,
    width: 170,
    windowWidth: 650
  });
});

document.getElementById("printButton").addEventListener("click", print);

document.getElementById("shortlinkButton").addEventListener("click", () => {
    let formData = new URLSearchParams();
    formData.append("url", location.href);
  fetch("https://spoo.me", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: formData
  })
  .then((response) => response.json())
  .then(({ short_url }) => {
    document.getElementById("feedbackModal").style.display = "flex";
    document.getElementById("feedbackModalContentCommentInput").value = short_url;
  });
});

document.getElementById("feedbackModalCloseIcon").addEventListener("click", () => {
  document.getElementById("feedbackModal").style.visibility = "hidden";
  document.getElementById("feedbackModal").style.opacity = "0";
  document.getElementById("feedbackModal").style.transition = "visibility 0s 0.175s, opacity 0.175s linear";
  setTimeout(() => {
    document.getElementById("feedbackModal").style.display = "none";
    document.getElementById("feedbackModal").style.removeProperty("visibility");
    document.getElementById("feedbackModal").style.removeProperty("opacity");
    document.getElementById("feedbackModal").style.removeProperty("transition");
  }, 175);
});

document.getElementById("copyShortLinkButton").addEventListener("click", () => {
  navigator.clipboard.writeText(document.getElementById("feedbackModalContentCommentInput").value);
});

document.getElementById("likeButton").addEventListener("click", () => {
  fetch("/api/v1/like", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          article: location.pathname.substring(1)
      })
  });
});

document.getElementById("dislikeButton").addEventListener("click", () => {
  fetch("/api/v1/dislike", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          article: location.pathname.substring(1)
      })
  });
});