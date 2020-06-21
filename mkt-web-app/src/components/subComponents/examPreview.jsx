import React, {Component} from 'react';
import NetworkUtils from '../../utilities/networkUtilities';

class ExamPreviewWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            examObject: props.examObject,
            pdf: []
        }
    }

        componentDidMount() {
            NetworkUtils.postWithBLOBResponse('/getExamPreview', this.state.examObject,
            (blob) => {
                console.log(blob);
                const file = new Blob(
                    [blob], 
                    {type: 'application/pdf'})
                const fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                // window.open(fileURL);
                // const file = new File( data, { type: "image/png" } );
                // const imageUrl = URL.createObjectURL(file)
                this.props.onPreviewCompleted(fileURL);
            },
            (error) => {

            });
        }

    render() {
        return (
            <div>
                Display Exam Previews Here
            </div>

        );
    }
} 

export default ExamPreviewWindow;