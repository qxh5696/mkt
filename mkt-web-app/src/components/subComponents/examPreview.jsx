import React, {Component} from 'react';
import NetworkUtils from '../../utilities/networkUtilities';
import { Document, Page, pdfjs   } from 'react-pdf';
import '../../assets/scss/examGenerationPage.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ExamPreviewWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            examObject: props.examObject,
            pdf: null,
            numPages: null,
            pageNumber: 1,
        }
    }


    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    componentDidMount() {
        NetworkUtils.postWithBLOBResponse('/getExamPreview', this.state.examObject,
        (blob) => {
            const file = new Blob(
                [blob], 
                {type: 'application/pdf'})
            const fileURL = URL.createObjectURL(file);
            this.props.onPreviewCompleted(fileURL);
            this.setState({ pdf: fileURL });
        },
        (error) => {
            console.log(error);
        });
    }

    render() {
        const { pageNumber, numPages } = this.state;
        return (
            <div>
                
                Display Exam Previews Here
                <Document
                    file={this.state.pdf}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>Page {pageNumber} of {numPages}</p>
            </div>

        );
    }
} 

export default ExamPreviewWindow;