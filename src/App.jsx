import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import gsap from "gsap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import "./App.css";

const initialLayout = [
  { i: "a", x: 0, y: 0, w: 10, h: 8, maxW: 10 },
  { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 10 },
  { i: "c", x: 4, y: 0, w: 1, h: 2, maxW: 10 },
];
const newOne = (old, setLayout) => {
  let newLayout = {};
  if (old && Array.isArray(old) && old.length > 10) {
    return alert("No of layout exceeded");
  }
  if (old && Array.isArray(old) && old.length > 0) {
    const charset = old[old.length - 1]?.i;
    const charCode = charset.charCodeAt(0);
    const i = String.fromCharCode(charCode + 1);
    const greatest = old.sort((a, b) => a.y - b.y)[0];
    if (greatest.x < 9) {
      newLayout = { i, x: greatest.x + 1, y: greatest.y, w: 1, h: 1, maxW: 10 };
    } else {
      newLayout = { i, x: 0, y: greatest.y + 1, w: 1, h: 1, maxW: 10 };
    }
    console.log(newLayout);
    setLayout((prev) => [...prev, newLayout]);
  }
  return null;
};

function App() {
  const [layout, setLayout] = useState(initialLayout);
  const [formData, setFormData] = useState({});
  const [renderer, setRender] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(id);
  };
  const handleSubmit = () => {
    if (formData?.image) {
      const image = <img src={formData.image} alt={renderer} />;
      setLayout((prev) =>
        prev.map((item) => (item.i === show ? { ...item, comp: image } : item))
      );
    }
    handleClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onabort = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleImage = async (e) => {
    const file = e.target.files[0];
    await getBase64(file).then((base64) => {
      setFormData((prev) => ({ ...prev, image: base64 }));
    });
  };

  const renderModelPopup = (id) => {
    handleShow(id);
  };

  return (
    <div className="App">
      <header className="App-header">POC on Drag and Drop</header>
      <main>
        <div className="mx-16 my-3 flex justify-between">
          <div className="mr-3 flex">
            <button
              className="text-white bg-yellow-600 outline-none border-none px-2 py-1 rounded mr-3 my-2"
              type="button"
              draggable={"true"}
              onDrag={(e) => setRender("image")}
            >
              Image
            </button>
            <button
              className="text-white bg-gray-600 outline-none border-none px-2 py-1 rounded mr-3 my-2"
              type="button"
              draggable={"true"}
              onDrag={(e) => setRender("slider")}
            >
              Slider
            </button>
            <button
              className="text-white bg-green-600 outline-none border-none px-2 py-1 rounded mr-3 my-2"
              type="button"
              draggable={"true"}
              onDrag={(e) => setRender("text")}
            >
              Text
            </button>
          </div>
          <button
            className="text-white bg-blue-600 outline-none border-none px-2 py-1 rounded"
            type="button"
            onClick={() => newOne(layout, setLayout)}
          >
            Add new
          </button>
        </div>
        <div>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={1200}
            onDragStop={(a, b, c, d) => console.log(a, b, c, d)}
          >
            {/* <div key="a" className="box_holder">
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>Welcome section</h2>
                <p>Short line about the section will be displayed here.</p>
              </div>{" "}
            </div> */}
            {layout.map((l) => (
              <div
                className="box_holder"
                key={l.i}
                onDragOver={(e) => {
                  e.preventDefault();
                  console.log(e);
                  gsap.set(e.target, { scale: 0.9 });
                }}
                onDragEnter={(e, a, b) => console.log(e, a, b)}
                onDragLeave={(e) => gsap.set(e.target, { scale: 1 })}
                onDrop={(e) => {
                  gsap.set(e.target, { scale: 1 });
                  renderModelPopup(l.i);
                }}
              >
                {l?.comp || l.i}
              </div>
            ))}
            {/* <div key="b" className="box_holder">
              b
            </div> */}
            {/* <div key="c" className="box_holder">
              c
            </div> */}
          </GridLayout>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add layout component</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
               <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              id="title"
              value={formData?.title || ""}
              onChange={handleChange}
              placeholder="Enter title"
            />
            <Form.Label htmlFor="description">description</Form.Label>
            <Form.Control
              as="textarea" 
              rows={3}
              id="description"
              name="description"
              value={formData?.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
            />
            <Form.Label htmlFor="short_code">Short code</Form.Label>
            <Form.Control
              type="text"
              name="short_code"
              id="short_code"
              value={formData?.short_code || ""}
              onChange={handleChange}
              placeholder="Enter short code"
            />
            <Form.Label htmlFor="image1">Enter the image url</Form.Label>
            <Form.Control
              type="string"
              name="image1"
              id="image1"
              className="border-black border-2"
              value={formData?.image1 || ""}
              onChange={handleChange}
              placeholder="Enter image url"
            />
            <div className="flex justify-center"> <Form.Text className="flex justify-center" id="passwordHelpBlock" muted>
       --------or---------
      </Form.Text></div>
            <Form.Label htmlFor="image2">Upload image</Form.Label>

            <Form.Control
              type="file"
              name="image2"
              id="image2"
              value={formData?.image2 || ""}
              onChange={handleImage}
              accept="image/*"
              className="border-black border-2"
            />
             </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add component
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
}

export default App;
